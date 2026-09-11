import Dexie, { type Table } from 'dexie';

export interface StoredAttempt {
  id?: number;
  exerciseId: string;
  topicId: string;
  subjectId: string;
  correct: boolean;
  timeMs: number;
  hintsUsed: number;
  at: number;
}

export interface StoredProfile {
  id: 'me';
  nickname: string;
  avatar: string;
  language: 'es' | 'ca';
  createdAt: number;
}

export interface StoredMastery {
  topicId: string;
  ewmaCorrect: number;
  level: 1 | 2 | 3 | 4 | 5;
  updatedAt: number;
}

class EstudiaDatabase extends Dexie {
  attempts!: Table<StoredAttempt, number>;
  profile!: Table<StoredProfile, 'me'>;
  mastery!: Table<StoredMastery, string>;

  constructor() {
    super('estudiaweb');
    this.version(1).stores({
      attempts: '++id, exerciseId, topicId, subjectId, at',
      profile: 'id',
      mastery: 'topicId'
    });
  }
}

export const db = new EstudiaDatabase();
