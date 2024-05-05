import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from "next/link";

export default function HomePage() {
    const { data: session, status } = useSession()
    const [classCodes, setClassCodes] = useState([])

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn()
        }
    }, [status])

    const fetchClassCodes = async () => {
        const response = await fetch('/api/class-codes')
        const data = await response.json()
        setClassCodes(data)
    }

    useEffect(() => {
        fetchClassCodes()
    }, [])

    if (!session){
        return <div>Not signed in...</div>
    }

    const onClassCodeSubmitted = async (event) => {
        event.preventDefault()
        const classCode = event.target.classCodeInput.value
        const response = await fetch('/api/class-codes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: classCode })
        })
        if (response.ok){
            await fetchClassCodes()
        }
    }

    return <div>
        <section className='section'>
            <div className='title'>Welcome back, {session.user.name}</div>
            <form onSubmit={(event)=>onClassCodeSubmitted(event)}>
                <div className = "field has-addons">
                    <p className = "control">
                        <input className="input" type = "text" name="classCodeInput" placeholder="Class code"/>
                    </p>
                    <p className = "control">
                        <button className="button is-primary">Create Class Code</button>
                    </p>
                </div>
            </form>
        </section>
        <section className='section'>
            <div className='title is-5'>View Class Codes</div>
            <table className='table'>
                <thead>
                    <th>Class Code</th>
                    <th>Date Created</th>
                </thead>
                <tbody>
                    {classCodes.map((classCode, index) => {
                        return <tr key={index}>
                            <td>
                                <Link href={`/app/${classCode.id}`}>
                                {classCode.id}
                                </Link>
                            </td>
                            <td>{
                                classCode.createdAt? new Date(classCode.createdAt).toString():
                                'No Date'}
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>

        </section>
    </div>

}