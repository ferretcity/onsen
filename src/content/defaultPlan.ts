import type { Plan } from '@/types'

// Placeholder content — replace with your own practices. A practice's `kind`
// determines how its occasions are addressed: "structured-reading" maps a
// fixed-length cycle onto the calendar (today is always some specific
// occasion); "session-based" is an ordered sequence a group works through
// manually, at its own pace, with no "today."
//
// `prompt` is what makes a slot a conversation instead of a checklist — the
// question a family, small group, or team actually talks through together
// after the reading/content. It's optional per item, but leave it out only
// when there's truly nothing to discuss.
export const defaultPlan: Plan = {
  organizationName: '',
  practices: [
    {
      id: 'daily-rhythm',
      kind: 'structured-reading',
      name: 'Daily Rhythm',
      tagline: 'A daily rhythm, shared.',
      slots: [
        { id: 'dawn', label: 'Dawn' },
        { id: 'midday', label: 'Midday' },
        { id: 'evening', label: 'Evening' },
      ],
      occasionCount: 3,
      occasions: [
        {
          dawn: [
            {
              id: 'd1-dawn-1',
              title: 'Example Reading 1.1',
              body: 'Replace this with the first item shown in the Dawn slot on day 1 of your cycle.',
              prompt: 'What stood out to you this morning?',
            },
          ],
          midday: [
            {
              id: 'd1-midday-1',
              title: 'Example Reading 1.2',
              body: 'Replace this with the first item shown in the Midday slot on day 1.',
              prompt: 'Where has this shown up in your day so far?',
            },
          ],
          evening: [
            {
              id: 'd1-evening-1',
              title: 'Example Reading 1.3',
              body: 'Replace this with the first item shown in the Evening slot on day 1.',
              prompt: 'What would you want the people around you to know about today?',
            },
          ],
        },
        {
          dawn: [
            {
              id: 'd2-dawn-1',
              title: 'Example Reading 2.1',
              body: 'Day 2, Dawn slot content goes here.',
              prompt: 'What are you carrying into today?',
            },
          ],
          midday: [
            {
              id: 'd2-midday-1',
              title: 'Example Reading 2.2',
              body: 'Day 2, Midday slot content goes here.',
              prompt: 'Who could use a check-in from you right now?',
            },
          ],
          evening: [
            {
              id: 'd2-evening-1',
              title: 'Example Reading 2.3',
              body: 'Day 2, Evening slot content goes here.',
              prompt: 'What are you grateful for today?',
            },
          ],
        },
        {
          dawn: [
            {
              id: 'd3-dawn-1',
              title: 'Example Reading 3.1',
              body: 'Day 3, Dawn slot content goes here.',
              prompt: 'What does trust look like for you today?',
            },
          ],
          midday: [
            {
              id: 'd3-midday-1',
              title: 'Example Reading 3.2',
              body: 'Day 3, Midday slot content goes here.',
              prompt: 'What is one honest thing you could say out loud right now?',
            },
          ],
          evening: [
            {
              id: 'd3-evening-1',
              title: 'Example Reading 3.3',
              body: 'Day 3, Evening slot content goes here.',
              prompt: 'What did today teach you about the people you did it with?',
            },
          ],
        },
      ],
    },
    {
      id: 'small-group',
      kind: 'session-based',
      name: 'Small Group',
      tagline: 'A sequence to work through together.',
      slots: [
        { id: 'opening', label: 'Opening' },
        { id: 'discussion', label: 'Discussion' },
        { id: 'closing', label: 'Closing' },
      ],
      occasionCount: 2,
      occasions: [
        {
          opening: [
            {
              id: 's1-opening-1',
              title: 'Welcome',
              body: 'Replace this with an icebreaker or opening note for session 1.',
              prompt: 'What is one thing you are hoping to get out of this group?',
            },
          ],
          discussion: [
            {
              id: 's1-discussion-1',
              title: 'Session 1 topic',
              body: 'Replace this with the main content or reading for session 1.',
              prompt: 'What stood out to you, and what did you disagree with?',
            },
          ],
          closing: [
            {
              id: 's1-closing-1',
              title: 'Closing',
              body: 'Replace this with closing remarks or logistics for next time.',
              prompt: 'What is one thing you will carry with you until we meet again?',
            },
          ],
        },
        {
          opening: [
            {
              id: 's2-opening-1',
              title: 'Check-in',
              body: 'Replace this with session 2’s opening note.',
              prompt: 'What has changed since last time we met?',
            },
          ],
          discussion: [
            {
              id: 's2-discussion-1',
              title: 'Session 2 topic',
              body: 'Replace this with the main content or reading for session 2.',
              prompt: 'Where do you see this showing up in your own life?',
            },
          ],
          closing: [
            {
              id: 's2-closing-1',
              title: 'Closing',
              body: 'Replace this with closing remarks or logistics for next time.',
              prompt: 'Who is one person you could share this with?',
            },
          ],
        },
      ],
    },
  ],
}
