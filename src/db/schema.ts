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

export interface StoredSessionResult {
  sessionId: string;
  stars: 0 | 1 | 2 | 3;
  correct: number;
  total: number;
  at: number;
}

class EstudiaDatabase extends Dexie {
  attempts!: Table<StoredAttempt, number>;
  profile!: Table<StoredProfile, 'me'>;
  mastery!: Table<StoredMastery, string>;
  sessionResults!: Table<StoredSessionResult, string>;

  constructor() {
    super('estudiaweb');
    this.version(1).stores({
      attempts: '++id, exerciseId, topicId, subjectId, at',
      profile: 'id',
      mastery: 'topicId'
    });
    // v2: añade sessionResults sin migrar datos anteriores.
    this.version(2).stores({
      attempts: '++id, exerciseId, topicId, subjectId, at',
      profile: 'id',
      mastery: 'topicId',
      sessionResults: 'sessionId'
    });
  }
}

export const db = new EstudiaDatabase();
