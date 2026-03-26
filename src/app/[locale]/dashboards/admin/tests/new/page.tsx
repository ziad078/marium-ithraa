import { createTest } from '@/features/tests/api'
import TestCreationWizzard from '@/features/tests/components/TestCreationWizzard'
import React from 'react'

const page = async() => {
    const res = await createTest({
        "title": "Nihil eum in dolor n",
        "description": "Dolores officia repe",
        "questions": [
            {
                "content": "Quia cupiditate eos ",
                "answers": [
                    {
                        "text": "Adipisicing in minim",
                        "score": "74"
                    },
                    {
                        "text": "Dolore architecto ex",
                        "score": "96"
                    },
                    {
                        "text": "Atque ut et aperiam ",
                        "score": "13"
                    }
                ],
                "id": "167f2a09-e229-4705-a7f6-eb8ce052daa5"
            }
        ]
    }
     )
    console.log(await res.json())
    return (
        <main>
            <TestCreationWizzard />
        </main>
    )
}

export default page