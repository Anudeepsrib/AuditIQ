import type { Role } from '../types/auth';

const GOING_CONCERN_RECALL_THRESHOLD = 0.95;

export function isGoingConcernGatePassed(recall: number): boolean {
  return recall >= GOING_CONCERN_RECALL_THRESHOLD;
}

export function canPromoteModel(recall: number, role: Role): boolean {
  if (role !== 'admin') return false;
  return isGoingConcernGatePassed(recall);
}

export function getGateStatus(recall: number): 'passed' | 'failed' {
  return isGoingConcernGatePassed(recall) ? 'passed' : 'failed';
}

export function getRecallGap(recall: number): number {
  return Math.max(0, GOING_CONCERN_RECALL_THRESHOLD - recall);
}

export function formatRecall(recall: number): string {
  return `${(recall * 100).toFixed(2)}%`;
}

export function formatRecallWithThreshold(recall: number): string {
  return `${formatRecall(recall)} / ${(GOING_CONCERN_RECALL_THRESHOLD * 100).toFixed(0)}% required`;
}

export const GOING_CONCERN_GATE_HELP = {
  title: 'Going Concern Recall Gate',
  description: 'Models must achieve at least 95% recall on going concern detection before promotion to production.',
  threshold: GOING_CONCERN_RECALL_THRESHOLD,
  why: 'Going concern flags are critical financial indicators. Missing one could have significant regulatory and financial implications.',
  action: 'Retrain with more diverse examples or adjust class weights in training configuration.',
};
