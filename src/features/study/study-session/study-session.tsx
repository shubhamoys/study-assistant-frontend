"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header/site-header";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { DECK_QUERY, type DeckQueryData, type DeckQueryVars } from "@/features/store/graphql";
import { Flashcard } from "../flashcard/flashcard";
import { getStudyErrorMessage } from "../get-study-error-message";
import {
  COMPLETE_STUDY_SESSION_MUTATION,
  NEXT_CARD_QUERY,
  SUBMIT_CARD_REVIEW_MUTATION,
  type CompleteStudySessionData,
  type CompleteStudySessionVars,
  type NextCardData,
  type NextCardVars,
  type Rating,
  type SubmitCardReviewData,
  type SubmitCardReviewVars,
} from "../graphql";
import { RatingButtons } from "../rating-buttons/rating-buttons";
import styles from "./study-session.module.scss";

interface StudySessionProps {
  deckId: string;
}

export function StudySession({ deckId }: StudySessionProps) {
  const { isReady } = useRequireAuth();
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sessionIdRef = useRef<string | undefined>(undefined);
  const sessionClosedRef = useRef(false);

  const { data: deckData } = useQuery<DeckQueryData, DeckQueryVars>(DECK_QUERY, {
    variables: { id: deckId },
    skip: !isReady,
  });

  const {
    data,
    loading,
    error,
    refetch: refetchNextCard,
  } = useQuery<NextCardData, NextCardVars>(NEXT_CARD_QUERY, {
    variables: { deckId },
    skip: !isReady,
    fetchPolicy: "network-only",
  });

  const [submitCardReview, { loading: submitting }] = useMutation<
    SubmitCardReviewData,
    SubmitCardReviewVars
  >(SUBMIT_CARD_REVIEW_MUTATION);

  const [completeStudySession] = useMutation<
    CompleteStudySessionData,
    CompleteStudySessionVars
  >(COMPLETE_STUDY_SESSION_MUTATION);

  // Best-effort: close out an abandoned session if the learner navigates away
  // mid-queue rather than finishing it (see handleRate for the normal path).
  // Genuine unmount cleanup — there's no user event to hook this into, so
  // it has to be an effect, not the usual "move it into a handler" fix.
  const completeStudySessionRef = useRef(completeStudySession);
  useEffect(() => {
    completeStudySessionRef.current = completeStudySession;
  }, [completeStudySession]);
  useEffect(() => {
    return () => {
      if (sessionIdRef.current && !sessionClosedRef.current) {
        sessionClosedRef.current = true;
        void completeStudySessionRef.current({
          variables: { sessionId: sessionIdRef.current },
        });
      }
    };
  }, []);

  if (!isReady) {
    return null;
  }

  async function handleRate(rating: Rating) {
    if (!data?.nextCard) return;
    setErrorMessage(null);
    try {
      const { data: result } = await submitCardReview({
        variables: {
          input: {
            deckId,
            cardId: data.nextCard.cardId,
            rating,
            sessionId: sessionIdRef.current,
          },
        },
      });
      if (!result) return;

      sessionIdRef.current = result.submitCardReview.sessionId;
      setReviewedCount((count) => count + 1);
      setShowAnswer(false);

      const { data: refetched } = await refetchNextCard();
      if (!refetched?.nextCard) {
        sessionClosedRef.current = true;
        await completeStudySession({
          variables: { sessionId: result.submitCardReview.sessionId },
        });
        setIsComplete(true);
      }
    } catch (submitError) {
      setErrorMessage(getStudyErrorMessage(submitError));
    }
  }

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.deckRow}>
            <Link href="/library" className={styles.backLink}>
              ← Back
            </Link>
            <h1 className={styles.deckTitle}>
              Deck: {deckData?.deck.title ?? "…"}
            </h1>
          </div>

          {loading && !data && <p className={styles.status}>Loading…</p>}

          {error && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorBadge} aria-hidden="true">
                !
              </span>
              <span>{getStudyErrorMessage(error)}</span>
            </div>
          )}

          {errorMessage && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorBadge} aria-hidden="true">
                !
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {isComplete && (
            <div className={`${styles.emptyState} index-card-dashed`}>
              <p className={styles.emptyHeadline}>Session complete.</p>
              <p className={styles.emptyBody}>
                You reviewed {reviewedCount}{" "}
                {reviewedCount === 1 ? "card" : "cards"}.
              </p>
              <Link href="/library" className={styles.emptyLink}>
                Back to library →
              </Link>
            </div>
          )}

          {!isComplete && !loading && !error && data && !data.nextCard && (
            <div className={`${styles.emptyState} index-card-dashed`}>
              <p className={styles.emptyHeadline}>Nothing due right now.</p>
              <p className={styles.emptyBody}>
                You&apos;re all caught up on this deck.
              </p>
              <Link href="/library" className={styles.emptyLink}>
                Back to library →
              </Link>
            </div>
          )}

          {!isComplete && data?.nextCard && (
            <div className={styles.studyArea}>
              <Flashcard
                key={data.nextCard.cardId}
                front={data.nextCard.front}
                back={data.nextCard.back}
                revealed={showAnswer}
              />

              {!showAnswer ? (
                <Button
                  size="lg"
                  className={styles.showAnswerButton}
                  onClick={() => setShowAnswer(true)}
                >
                  Show answer
                </Button>
              ) : (
                <RatingButtons
                  again={data.nextCard.again}
                  hard={data.nextCard.hard}
                  good={data.nextCard.good}
                  easy={data.nextCard.easy}
                  disabled={submitting}
                  onRate={(rating) => void handleRate(rating)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
