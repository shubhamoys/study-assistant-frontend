"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/markdown-editor/markdown-editor";
import { resolveAssetUrl } from "@/lib/asset-url";
import { uploadAttachment } from "@/lib/upload-attachment";
import {
  CATEGORIES_QUERY,
  CREATE_DECK_MUTATION,
  UPDATE_DECK_MUTATION,
  type CategoriesQueryData,
  type CreateDeckMutationData,
  type CreateDeckMutationVars,
  type UpdateDeckMutationData,
  type UpdateDeckMutationVars,
} from "@/features/store/graphql";
import { deckSchema, type DeckFormValues } from "@/features/store/schemas";
import authFormStyles from "@/features/auth/auth-form.module.scss";
import styles from "./deck-form.module.scss";

function getDeckErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code;
    if (code === "NOT_FOUND") return "This deck no longer exists.";
    if (code === "BAD_REQUEST") return "Please check the highlighted fields.";
  }
  return "Something went wrong. Please try again.";
}

interface DeckFormInitial {
  title: string;
  description: string | null;
  coverUrl: string | null;
  categoryId: string | null;
}

interface DeckFormProps {
  mode: "create" | "edit";
  deckId?: string;
  initial?: DeckFormInitial;
}

export function DeckForm({ mode, deckId, initial }: DeckFormProps) {
  const router = useRouter();
  const [succeeded, setSucceeded] = useState(false);
  const { data: categoriesData } =
    useQuery<CategoriesQueryData>(CATEGORIES_QUERY);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeckFormValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? undefined,
      coverUrl: initial?.coverUrl ?? undefined,
      categoryId: initial?.categoryId ?? "",
    },
  });

  const [createDeck, { error: createError }] = useMutation<
    CreateDeckMutationData,
    CreateDeckMutationVars
  >(CREATE_DECK_MUTATION);
  const [updateDeck, { error: updateError }] = useMutation<
    UpdateDeckMutationData,
    UpdateDeckMutationVars
  >(UPDATE_DECK_MUTATION);
  const error = createError ?? updateError;

  async function onSubmit(values: DeckFormValues) {
    setSucceeded(false);
    try {
      if (mode === "create") {
        const { data } = await createDeck({ variables: { input: values } });
        if (data) router.push(`/decks/${data.createDeck.id}/edit`);
      } else if (deckId) {
        await updateDeck({ variables: { id: deckId, input: values } });
        setSucceeded(true);
      }
    } catch {
      // Surfaced via the reactive `error` state below.
    }
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
          <span>{getDeckErrorMessage(error)}</span>
        </div>
      )}

      {succeeded && (
        <div className={authFormStyles.formNotice} role="status">
          <span className={authFormStyles.formNoticeBadge} aria-hidden="true">
            ✓
          </span>
          <span>Saved.</span>
        </div>
      )}

      <div className={authFormStyles.field}>
        <label className={authFormStyles.fieldLabel} htmlFor="deck-title">
          Title
        </label>
        <Input
          id="deck-title"
          aria-invalid={Boolean(errors.title)}
          {...register("title")}
        />
        {errors.title && (
          <span className={authFormStyles.fieldError}>
            {errors.title.message}
          </span>
        )}
      </div>

      <div className={authFormStyles.field}>
        <label
          className={authFormStyles.fieldLabel}
          htmlFor="deck-description"
        >
          Description (optional)
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <MarkdownEditor
              id="deck-description"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="What's this deck about?"
            />
          )}
        />
      </div>

      <div className={authFormStyles.field}>
        <label className={authFormStyles.fieldLabel} htmlFor="deck-category">
          Category (optional)
        </label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              id="deck-category"
              aria-invalid={Boolean(errors.categoryId)}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            >
              <option value="">No category</option>
              {categoriesData?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          )}
        />
        {errors.categoryId && (
          <span className={authFormStyles.fieldError}>
            {errors.categoryId.message}
          </span>
        )}
      </div>

      <CoverUploader control={control} />

      <Button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting
          ? "Saving…"
          : mode === "create"
            ? "Create deck"
            : "Save changes"}
      </Button>
    </form>
  );
}

function CoverUploader({ control }: { control: Control<DeckFormValues> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Controller
      name="coverUrl"
      control={control}
      render={({ field }) => {
        async function handleChange(
          event: React.ChangeEvent<HTMLInputElement>,
        ) {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setUploading(true);
          setError(null);
          const result = await uploadAttachment(file);
          setUploading(false);
          if (result.ok) field.onChange(result.url);
          else setError(result.error);
        }

        return (
          <div className={authFormStyles.field}>
            <span className={authFormStyles.fieldLabel}>
              Cover image (optional)
            </span>
            <div className={styles.coverRow}>
              {field.value && (
                // eslint-disable-next-line @next/next/no-img-element -- backend-origin URL.
                <img
                  src={resolveAssetUrl(field.value) ?? field.value}
                  alt=""
                  className={styles.coverPreview}
                />
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading
                  ? "Uploading…"
                  : field.value
                    ? "Change cover"
                    : "Upload cover"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className={styles.hiddenInput}
                onChange={(event) => void handleChange(event)}
              />
            </div>
            {error && (
              <span className={authFormStyles.fieldError}>{error}</span>
            )}
          </div>
        );
      }}
    />
  );
}
