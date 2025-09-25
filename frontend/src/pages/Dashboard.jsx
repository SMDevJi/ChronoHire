import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { useSelector } from 'react-redux'
import { isJwtExpired } from '@/utils/utilities';
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';



function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so add 1) and pad
  const year = date.getFullYear(); // Get full year

  return `${day}-${month}-${year}`;
}

const interviews = [
  {
    "role": "Frontend Developer",
    "yearsOfExperience": 2,
    "createdAt": new Date()
  },
  {
    "role": "Frontend Developer",
    "yearsOfExperience": 2,
    "createdAt": new Date()
  },
  {
    "role": "Frontend Developer",
    "yearsOfExperience": 2,
    "createdAt": new Date()
  },
  {
    "role": "Frontend Developer",
    "yearsOfExperience": 2,
    "createdAt": new Date()
  },
  {
    "role": "Frontend Developer",
    "yearsOfExperience": 2,
    "createdAt": new Date()
  }
]

function Dashboard() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null)
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [yearsOfExperience, setYOE] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [resume, setResume] = useState(null);
  const [creating, setCreating] = useState(false)
  const [pastInterviews, setPastInterviews] = useState([])
  const authorization = useSelector((state) => state.user.authorization);
  const navigate = useNavigate()

  const setOpenChange = (o) => {
    setError(null)
    setOpen(o)
  }


  const fetchInterviews=()=>{

  }


  useEffect(() => {
    if (!authorization) {
      navigate('/login');
      return;
    }

    if (isJwtExpired(authorization)) {
      navigate('/login');
      return;
    }

  }, [authorization, navigate]);



  const handleSubmit = async () => {
    if (!role || !description || !yearsOfExperience || !difficulty || !resume) {
      setError("Please fill all the fields!")
      return
    }
    console.log(difficulty)

    try {
      const formData = new FormData();
      formData.append("role", role);
      formData.append("description", description);
      formData.append("yearsOfExperience", yearsOfExperience);
      formData.append("difficulty", difficulty);
      formData.append("resumeFile", resume);

      setCreating(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/create`, formData, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${authorization}` }
      }).finally(() =>
        setCreating(false)
      );

      if (res.data.success) {
        toast.success("Interview created successfully!")
        setOpen(false)
        navigate(`/interview-details/${res.data.interviewId}`)
      } else {
        setError("Failed to generate interview!")
      }

      console.log("Interview created:", res.data);
    } catch (err) {
      console.error("Error creating interview:", err.response?.data || err.message);
    }
  };


  return (
    <div className='dash max-w-7xl mx-auto p-6'>
      <h1 className='mt-2 text-3xl font-bold text-purple-600'>Dashboard</h1>
      <p className='text-gray-500 font-medium'>Create and Start your AI Mock Interview</p>

      <Dialog open={open} onOpenChange={setOpenChange}>
        <form>
          <DialogTrigger asChild>
            <div className="cursor-pointer max-w-80 mt-3 add-btn bg-gray-200  p-10 rounded-md flex justify-center items-center    transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-gray-400">
              <p className='text-gray-800 font-medium'>+ Add New</p>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className='mb-4'>
              <DialogTitle className='font-bold text-start'>Tell us more about your job interviewing</DialogTitle>
              <DialogDescription className='text-start text-gray-500 font-semibold'>
                Add details about your job position/role, Job description and years of experience
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">


              <div className="grid gap-1">
                <Label htmlFor="role" className='text-gray-500'>Job Role/Job Position</Label>
                <Input id="role" name="role" placeholder='Ex. Full Stack Developer' className='focus-visible:ring-1' onChange={(e) => setRole(e.target.value)} />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="description" className='text-gray-500'>Job Description/Tech Stack (In Short)</Label>
                <Input id="description" name="description" placeholder='Ex. React, Angular, NodeJS, MySql etc' className='focus-visible:ring-1' onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="yearsOfExperience" className='text-gray-500'>Years Of experience</Label>
                <Input id="yearsOfExperience" name="yearsOfExperience" placeholder='Ex.5' type='number' className='focus-visible:ring-1' onChange={(e) => setYOE(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="difficulty" className='mb-1 text-gray-500'>Difficulty level</Label>
                <Select id='difficulty' name='difficulty' onValueChange={(value) => setDifficulty(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div className="grid  gap-1 ">
                <Label htmlFor="resume" className='text-gray-500'>Upload Your Resume</Label>
                <Input id="resume" type="file" onChange={(e) => setResume(e.target.files[0])} accept=".docx, .pdf" />
              </div>

            </div>
            <div className="error flex justify-center">
              {error && <p className='text-red-500'>{error}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className='cursor-pointer'>Cancel</Button>
              </DialogClose>
              <Button type="submit" className={`${creating ? 'bg-purple-400 hover:bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} cursor-pointer`} onClick={handleSubmit} >
                {creating ? <FaSpinner className="animate-spin" /> : ''}
                {creating ? 'Generating Interview...' : 'Create Interview'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <h1 className='text-gray-800 my-3 font-semibold text-xl'>Previous Mock Interviews</h1>
      <div className="prev-interviews grid md:grid-cols-3 gap-3">
        {interviews.map((interview, idx) =>
          <div className="interview border-2 rounded-md p-4" key={idx}>
            <h1 className='text-purple-900 text-xl font-bold'>{interview.role}</h1>
            <p className='font-medium'>{interview.yearsOfExperience} Years of Experience</p>
            <p className='text-gray-500'>Created At: {formatDate(interview.createdAt)}</p>
            <div className="buttons grid grid-cols-2 gap-3 mt-2">
              <button className='cursor-pointer rounded border-1 font-bold px-3 py-2'>Feedback</button>
              <button className='cursor-pointer bg-purple-600 rounded font-bold text-white px-3 py-2'>Start</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard