import React from 'react'
import { useParams } from 'react-router-dom'

function ConductInterview() {
    const { interviewId } = useParams()
    return (
        <div>ConductInterview {interviewId}</div>
    )
}

export default ConductInterview