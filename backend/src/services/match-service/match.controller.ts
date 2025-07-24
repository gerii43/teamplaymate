import { Request, Response, NextFunction } from 'express';
import { MatchService } from './match.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { asyncHandler } from '../../shared/middleware/error.middleware';
import { logger } from '../../shared/utils/logger';

export class MatchController {
  private matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  getMatches = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = req.query;

    const result = await this.matchService.getMatches(page, limit, filters);
    
    res.json(ApiResponse.paginated(
      result.matches,
      page,
      limit,
      result.total,
      'Matches retrieved successfully'
    ));
  });

  getMatchById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const match = await this.matchService.getMatchById(id);
    
    if (!match) {
      return res.status(404).json(ApiResponse.error('Match not found'));
    }

    res.json(ApiResponse.success(match, 'Match retrieved successfully'));
  });

  createMatch = asyncHandler(async (req: Request, res: Response) => {
    const matchData = req.body;
    const match = await this.matchService.createMatch(matchData);
    
    res.status(201).json(ApiResponse.success(match, 'Match created successfully'));
  });

  updateMatch = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const match = await this.matchService.updateMatch(id, updateData);
    
    if (!match) {
      return res.status(404).json(ApiResponse.error('Match not found'));
    }

    res.json(ApiResponse.success(match, 'Match updated successfully'));
  });

  deleteMatch = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.matchService.deleteMatch(id);
    
    res.json(ApiResponse.success(undefined, 'Match deleted successfully'));
  });

  addMatchEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const eventData = req.body;
    
    const event = await this.matchService.addMatchEvent(id, eventData);
    
    res.status(201).json(ApiResponse.success(event, 'Match event added successfully'));
  });

  getMatchStatistics = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const statistics = await this.matchService.getMatchStatistics(id);
    
    res.json(ApiResponse.success(statistics, 'Match statistics retrieved successfully'));
  });

  addMatchNote = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const noteData = req.body;
    
    const note = await this.matchService.addMatchNote(id, noteData);
    
    res.status(201).json(ApiResponse.success(note, 'Match note added successfully'));
  });

  getMatchNotes = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const notes = await this.matchService.getMatchNotes(id);
    
    res.json(ApiResponse.success(notes, 'Match notes retrieved successfully'));
  });

  startMatch = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const match = await this.matchService.startMatch(id);
    
    res.json(ApiResponse.success(match, 'Match started successfully'));
  });

  endMatch = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const match = await this.matchService.endMatch(id);
    
    res.json(ApiResponse.success(match, 'Match ended successfully'));
  });
}