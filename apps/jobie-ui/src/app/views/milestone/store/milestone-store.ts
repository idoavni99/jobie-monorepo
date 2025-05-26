import { TMilestone } from '@jobie/milestone/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { milestoneMangementApi } from '../../../../api/milestone-management.api';

type MilestoneState = {
  milestones: Record<string, TMilestone>;
  fetchMilestone: (milestoneId: string) => Promise<void>;
  toggleStep: (
    milestoneId: string,
    stepId: string,
    completed: boolean
  ) => Promise<void>;
  generateNextMilestone: (milestoneId: string) => Promise<void>;
};

export const useMilestoneStore = create<MilestoneState>()(
  devtools(
    (set) => ({
      milestones: {},

      fetchMilestone: async (milestoneId) => {
        try {
          const { data } = await milestoneMangementApi.get<TMilestone>('/', {
            params: { milestoneId },
          });

          set(
            (state) => ({
              milestones: {
                ...state.milestones,
                [milestoneId]: data,
              },
            }),
            false,
            'fetchMilestone'
          );
        } catch (error) {
          console.error('[fetchMilestone] Failed to fetch milestone', error);
        }
      },
      toggleStep: async (milestoneId, stepId, completed) => {
        try {
          await milestoneMangementApi.patch('/toggleStep', {
            milestoneId,
            stepId,
            completed,
          });

          set(
            (state) => {
              const updatedSteps = state.milestones[milestoneId].steps.map(
                (step) => (step._id === stepId ? { ...step, completed } : step)
              );

              // Check if all steps are completed locally
              const isCompleted = updatedSteps.every((step) => step.completed);

              return {
                milestones: {
                  ...state.milestones,
                  [milestoneId]: {
                    ...state.milestones[milestoneId],
                    steps: updatedSteps,
                    status: isCompleted
                      ? 'completed'
                      : state.milestones[milestoneId].status,
                  },
                },
              };
            },
            false,
            'toggleStep'
          );
        } catch (error) {
          console.error('[toggleStep] Failed to toggle step', error);
        }
      },

      generateNextMilestone: async (milestoneId) => {
        try {
          const { data } = await milestoneMangementApi.post<TMilestone>(
            '/generateNext',
            {
              CurrentMilestoneId: milestoneId,
            }
          );

          // Add the new milestone to the store
          const newMilestoneId = data._id;
          set(
            (state) => ({
              milestones: {
                ...state.milestones,
                [newMilestoneId]: data,
              },
            }),
            false,
            'generateNextMilestone'
          );

          // Mark the current milestone as having generated the next one
          set(
            (state) => ({
              milestones: {
                ...state.milestones,
                [milestoneId]: {
                  ...state.milestones[milestoneId],
                  hasGeneratedNext: true,
                },
              },
            }),
            false,
            'updatePreviousMilestone'
          );
        } catch (error) {
          console.error(
            '[generateNextMilestone] Failed to generate next milestone',
            error
          );
        }
      },
    }),
    {
      name: 'MilestoneStore', // Will appear in Redux DevTools
    }
  )
);
