import { gql } from "@apollo/client";

export const STUDY_QUEUE_QUERY = gql`
  query StudyQueue($deckId: ID!) {
    studyQueue(deckId: $deckId) {
      deckId
      dueCount
      newCount
      totalCount
    }
  }
`;

export const NEXT_CARD_QUERY = gql`
  query NextCard($deckId: ID!) {
    nextCard(deckId: $deckId) {
      cardId
      front
      back
      again {
        intervalLabel
        dueAt
      }
      hard {
        intervalLabel
        dueAt
      }
      good {
        intervalLabel
        dueAt
      }
      easy {
        intervalLabel
        dueAt
      }
    }
  }
`;

export const SUBMIT_CARD_REVIEW_MUTATION = gql`
  mutation SubmitCardReview($input: SubmitCardReviewInput!) {
    submitCardReview(input: $input) {
      sessionId
      cardId
      state
      dueAt
    }
  }
`;

export const COMPLETE_STUDY_SESSION_MUTATION = gql`
  mutation CompleteStudySession($sessionId: ID!) {
    completeStudySession(sessionId: $sessionId)
  }
`;

export type Rating = "AGAIN" | "HARD" | "GOOD" | "EASY";

export interface RatingPreview {
  intervalLabel: string;
  dueAt: string;
}

export interface StudyQueueData {
  studyQueue: {
    deckId: string;
    dueCount: number;
    newCount: number;
    totalCount: number;
  };
}

export interface StudyQueueVars {
  deckId: string;
}

export interface NextCardData {
  nextCard: {
    cardId: string;
    front: string;
    back: string;
    again: RatingPreview;
    hard: RatingPreview;
    good: RatingPreview;
    easy: RatingPreview;
  } | null;
}

export interface NextCardVars {
  deckId: string;
}

export interface SubmitCardReviewData {
  submitCardReview: {
    sessionId: string;
    cardId: string;
    state: string;
    dueAt: string;
  };
}

export interface SubmitCardReviewVars {
  input: {
    deckId: string;
    cardId: string;
    rating: Rating;
    sessionId?: string;
  };
}

export interface CompleteStudySessionData {
  completeStudySession: boolean;
}

export interface CompleteStudySessionVars {
  sessionId: string;
}
