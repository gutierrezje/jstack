---
name: pstack-teach
description: "Explain a body of work plainly so a person actually understands it. Runs the `how` and `why` skills and weaves what they find into one clear explanation. Use for 'teach me this', 'help me really understand X', 'explain this change or subsystem to me'."
---

# Pstack teach

1. Run `$how` to establish current mechanics and `$why` to recover rationale when relevant.
2. Choose the smallest set of concepts the learner needs to form a correct mental model.
3. Explain from user-visible behavior inward, one layer at a time. Use a diagram only when it materially clarifies flow or ownership.
4. Ground each layer in code, runtime evidence, or cited history. Separate fact, inference, and analogy.
5. End with a compact recap and one check-for-understanding question or exercise.

Completion means the learner can predict one non-obvious behavior from the model without rereading the implementation.
