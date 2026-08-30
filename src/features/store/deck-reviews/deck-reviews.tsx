"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Avatar } from "@/components/avatar/avatar";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating/star-rating";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/use-auth";
import authFormStyles from "@/features/auth/auth-form.module.scss";
import {
  CREATE_REVIEW_MUTATION,
  DECK_QUERY,
  DECK_REVIEWS_QUERY,
  DELETE_REVIEW_MUTATION,
  UPDATE_REVIEW_MUTATION,
  type CreateReviewMutationData,
  type CreateReviewMutationVars,
  type DeckReviewsQueryData,
  type DeckReviewsQueryVars,
  type DeleteReviewMutationData,
  type DeleteReviewMutationVars,
  type Review,
  type UpdateReviewMutationData,
  type UpdateReviewMutationVars,
} from "../graphql";
import { reviewSchema, type ReviewFormValues } from "../schemas";
import styles from "./deck-reviews.module.scss";

function getReviewErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code;
    if (code === "CONFLICT") return "You've already reviewed this deck.";
    if (code === "NOT_FOUND") return "That review no longer exists.";
    if (code === "BAD_REQUEST") return "Please check your rating and comment.";
  }
  return "Something went wrong. Please try again.";
}

// Refetched (rather than relying on Apollo's automatic cache updates) after
// every review mutation — deckReviews for the list, deck for the aggregate
// ratingAverage/ratingCount shown elsewhere on this same page.
function refetchAfterReviewChange(deckId: string) {
  return [
    { query: DECK_QUERY, variables: { id: deckId } },
    { query: DECK_REVIEWS_QUERY, variables: { deckId } },
  ];
}

interface DeckReviewsProps {
  deckId: string;
}

export function DeckReviews({ deckId }: DeckReviewsProps) {
  const { user } = useAuth();
  const { data, loading } = useQuery<DeckReviewsQueryData, DeckReviewsQueryVars>(
    DECK_REVIEWS_QUERY,
    { variables: { deckId } },
  );

  const reviews = data?.deckReviews ?? [];
  const ownReview = reviews.find((review) => review.userId === user?.id);
  const otherReviews = reviews.filter((review) => review.userId !== user?.id);

  return (
    <section className={`${styles.section} index-card`}>
      <h2 className={styles.heading}>Reviews</h2>

      {/* Keyed on the review's identity so switching between "no review yet"
          and "has a review" (after create/delete) remounts the form with
          fresh defaultValues instead of needing an effect-driven reset. */}
      <ReviewForm key={ownReview?.id ?? "new"} deckId={deckId} existing={ownReview} />

      {loading && <p className={styles.status}>Loading reviews…</p>}
      {!loading && otherReviews.length === 0 && !ownReview && (
        <p className={styles.status}>No reviews yet — be the first.</p>
      )}

      {otherReviews.length > 0 && (
        <ul className={styles.list}>
          {otherReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <li className={styles.item}>
      <div className={styles.itemHeader}>
        <Avatar avatarUrl={review.authorAvatarUrl} label={review.authorDisplayName} size="sm" />
        <div className={styles.itemMeta}>
          <p className={styles.itemAuthor}>{review.authorDisplayName}</p>
          <StarRating value={review.rating} size={13} />
        </div>
        <time className={styles.itemDate} dateTime={review.createdAt}>
          {new Date(review.createdAt).toLocaleDateString()}
        </time>
      </div>
      {review.comment && <p className={styles.itemComment}>{review.comment}</p>}
    </li>
  );
}

interface ReviewFormProps {
  deckId: string;
  existing?: Review;
}

function ReviewForm({ deckId, existing }: ReviewFormProps) {
  // Starts in edit mode when there's nothing to display yet (no review),
  // and in read mode when there's an existing review to show first.
  const [editing, setEditing] = useState(!existing);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existing?.rating ?? 0,
      comment: existing?.comment ?? undefined,
    },
  });

  const [createReview, { error: createError }] = useMutation<
    CreateReviewMutationData,
    CreateReviewMutationVars
  >(CREATE_REVIEW_MUTATION, { refetchQueries: refetchAfterReviewChange(deckId) });

  const [updateReview, { error: updateError }] = useMutation<
    UpdateReviewMutationData,
    UpdateReviewMutationVars
  >(UPDATE_REVIEW_MUTATION, { refetchQueries: refetchAfterReviewChange(deckId) });

  const [deleteReview, { loading: deleting }] = useMutation<
    DeleteReviewMutationData,
    DeleteReviewMutationVars
  >(DELETE_REVIEW_MUTATION, { refetchQueries: refetchAfterReviewChange(deckId) });

  const error = createError ?? updateError;

  async function onSubmit(values: ReviewFormValues) {
    try {
      if (existing) {
        await updateReview({
          variables: { id: existing.id, input: values },
        });
      } else {
        await createReview({
          variables: { input: { deckId, ...values } },
        });
      }
      setEditing(false);
    } catch {
      // Surfaced via the reactive `error` state above.
    }
  }

  async function handleDelete() {
    if (!existing) return;
    try {
      await deleteReview({ variables: { id: existing.id } });
    } catch {
      // A failed delete just leaves the review as-is — no dedicated banner
      // for what's a low-stakes retry action.
    }
  }

  if (existing && !editing) {
    return (
      <div className={styles.ownReview}>
        <div className={styles.ownReviewHeader}>
          <StarRating value={existing.rating} size={16} />
          <div className={styles.ownReviewActions}>
            <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void handleDelete()}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
        {existing.comment && <p className={styles.ownReviewComment}>{existing.comment}</p>}
      </div>
    );
  }

  return (
    <form
      className={authFormStyles.fields}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      {error && (
        <div className={authFormStyles.formError} role="alert">
          <span className={authFormStyles.formErrorBadge} aria-hidden="true">
            !
          </span>
          <span>{getReviewErrorMessage(error)}</span>
        </div>
      )}

      <div className={authFormStyles.field}>
        <span className={authFormStyles.fieldLabel}>Your rating</span>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating value={field.value} onChange={field.onChange} size={22} />
          )}
        />
        {errors.rating && (
          <span className={authFormStyles.fieldError}>{errors.rating.message}</span>
        )}
      </div>

      <div className={authFormStyles.field}>
        <label className={authFormStyles.fieldLabel} htmlFor="review-comment">
          Comment (optional)
        </label>
        <Textarea
          id="review-comment"
          placeholder="What did you think of this deck?"
          aria-invalid={Boolean(errors.comment)}
          {...register("comment")}
        />
        {errors.comment && (
          <span className={authFormStyles.fieldError}>{errors.comment.message}</span>
        )}
      </div>

      <div className={styles.formActions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : existing ? "Save changes" : "Submit review"}
        </Button>
        {existing && (
          <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
