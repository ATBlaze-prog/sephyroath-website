'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const recruitmentSchema = z.object({
  fullName: z.string().min(1).max(50),
  age: z.coerce.number().int().positive(),
  gender: z.enum(['Male', 'Female', 'Others']),
  location: z.string().min(1),
  facebookProfileUrl: z.string().url(),
  tiktokProfileUrl: z.string().url(),
  gameId: z.string().min(1),
  currentIgn: z.string().min(1).max(50),
  userId: z.string().optional(),
});

type RecruitmentFormValues = z.infer<typeof recruitmentSchema>;

interface GameOption {
  id: string;
  title: string;
}

interface RecruitmentFormProps {
  games: GameOption[];
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function RecruitmentForm({ games }: RecruitmentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RecruitmentFormValues>({
    resolver: zodResolver(recruitmentSchema),
    mode: 'onChange',
  });

  const [facebookProofFile, setFacebookProofFile] = useState<File | null>(null);
  const [tiktokProofFile, setTiktokProofFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedGame = watch('gameId');

  const onSubmit = async (values: RecruitmentFormValues) => {
    if (!facebookProofFile || !tiktokProofFile) {
      setFeedback('Both proof screenshots are required.');
      return;
    }

    setSubmitting(true);
    setFeedback('');

    try {
      const facebookProofUrl = await fileToBase64(facebookProofFile);
      const tiktokProofUrl = await fileToBase64(tiktokProofFile);

      const response = await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          facebookProofUrl,
          tiktokProofUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFeedback(data.error || 'Failed to submit application.');
        setSubmitting(false);
        return;
      }

      setFeedback('Application submitted successfully. Admins will review it shortly.');
    } catch (error) {
      setFeedback('There was a problem submitting your application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-so-primary/20 bg-so-dark/80 p-8 shadow-2xl shadow-so-black/20">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-so-gold">Recruitment Questionnaire</h1>
          <p className="text-so-gray-300 mt-2">Complete the form below to apply for membership with SephyrOath.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-so-gray-200">
            Full Name
            <input
              type="text"
              {...register('fullName')}
              className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            />
            {errors.fullName && <span className="text-xs text-red-400">{errors.fullName.message}</span>}
          </label>
          <label className="space-y-2 text-sm text-so-gray-200">
            Age
            <input
              type="number"
              min={13}
              {...register('age', { valueAsNumber: true })}
              className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            />
            {errors.age && <span className="text-xs text-red-400">{errors.age.message}</span>}
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-so-gray-200">
            Gender
            <select
              {...register('gender')}
              className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            {errors.gender && <span className="text-xs text-red-400">{errors.gender.message}</span>}
          </label>
          <label className="space-y-2 text-sm text-so-gray-200">
            Location
            <input
              type="text"
              {...register('location')}
              className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            />
            {errors.location && <span className="text-xs text-red-400">{errors.location.message}</span>}
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-so-gray-200">
            Facebook Profile URL
            <input
              type="url"
              {...register('facebookProfileUrl')}
              className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            />
            {errors.facebookProfileUrl && <span className="text-xs text-red-400">{errors.facebookProfileUrl.message}</span>}
          </label>
          <label className="space-y-2 text-sm text-so-gray-200">
            TikTok Profile URL
            <input
              type="url"
              {...register('tiktokProfileUrl')}
              className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            />
            {errors.tiktokProfileUrl && <span className="text-xs text-red-400">{errors.tiktokProfileUrl.message}</span>}
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-so-gray-200">
            Follow Proof: Facebook
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFacebookProofFile(event.target.files?.[0] || null)}
              className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            />
          </label>
          <label className="space-y-2 text-sm text-so-gray-200">
            Follow Proof: TikTok
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setTiktokProofFile(event.target.files?.[0] || null)}
              className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-so-gray-200">
          Target Game
          <select
            {...register('gameId')}
            className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
          >
            <option value="">Select a game</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </select>
          {errors.gameId && <span className="text-xs text-red-400">{errors.gameId.message}</span>}
        </label>

        {selectedGame && (
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-so-gray-200">
              Current IGN
              <input
                type="text"
                {...register('currentIgn')}
                className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
              />
              {errors.currentIgn && <span className="text-xs text-red-400">{errors.currentIgn.message}</span>}
            </label>
            <label className="space-y-2 text-sm text-so-gray-200">
              User ID
              <input
                type="text"
                placeholder="Discord or game ID"
                {...register('userId')}
                className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
              />
            </label>
          </div>
        )}

        {feedback && <p className="text-sm text-so-gray-200">{feedback}</p>}

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full rounded-2xl bg-gradient-fire px-5 py-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? 'Submitting application…' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
