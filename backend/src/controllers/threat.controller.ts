import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getAllThreats = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const where: any = {};

    if (category) where.Threat_Category = category;
    if (search)
      where.Cleaned_Threat_Description = {
        contains: search,
        mode: 'insensitive',
      };

    // Get total count for pagination metadata
    const total = await prisma.threat.count({ where });

    const threats = await prisma.threat.findMany({
      where,
      skip: (+page - 1) * +limit,
      take: +limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / +limit);
    const hasNextPage = +page < totalPages;
    const hasPrevPage = +page > 1;

    res.json({
      threats,
      pagination: {
        currentPage: +page,
        totalPages,
        totalItems: total,
        itemsPerPage: +limit,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        category: category || null,
        search: search || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch threats' });
  }
};

export const getThreatById = async (req: Request, res: Response) => {
  try {
    const threat = await prisma.threat.findUnique({
      where: { id: +req.params.id },
    });

    if (!threat) {
      res.status(404).json({ error: 'Threat not found' });
      return;
    }
    res.json(threat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch threat' });
  }
};

export const getThreatStats = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.threat.count();

    const byCategory = await prisma.threat.groupBy({
      by: ['Threat_Category'],
      _count: { _all: true },
    });

    const bySeverity = await prisma.threat.groupBy({
      by: ['Severity_Score'],
      _count: { _all: true },
    });

    res.json({ total, byCategory, bySeverity });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.threat.findMany({
      distinct: ['Threat_Category'],
      select: { Threat_Category: true },
      orderBy: { Threat_Category: 'asc' },
    });
    res.json(categories.map(c => c.Threat_Category));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
