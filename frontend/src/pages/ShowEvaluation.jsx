import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { LuWebcam } from 'react-icons/lu'
import { MdLightbulbOutline } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

function ShowEvaluation() {
    const { interviewId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [interview, setInterview] = useState({})
    const authorization = useSelector((state) => state.user.authorization);
    const navigate = useNavigate()
    
    const loadInterview = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/${interviewId}`, {
                headers: {
                    Authorization: `Bearer ${authorization}`
                },
            });

            const interviewData = response.data.interview;

            setInterview(interviewData);
            console.log(interviewData)
        } catch (error) {
            console.error(error);
            setError(error)
            toast.error("Failed to load Interview details");

            if (error.response.status === 401) {
                navigate('/login')
                return
            }
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        loadInterview()
    }, [authorization, navigate, interviewId]);

    if (error) {
        return <div className='wrapper min-h-[80vh] px-4'>
            <Error />
        </div>
    }


    if (loading) {
        return <div className='wrapper min-h-[80vh] px-4'>
            <Loading />
        </div>
    }


    return (
        <div className='details max-w-5xl lg:max-w-6xl mx-auto p-6 my-5'>
            
        </div>
    )
}

export default ShowEvaluation