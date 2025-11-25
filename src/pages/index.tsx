import React from 'react'
import { useRouter } from 'next/router'


const Index = () => {
  const router = useRouter()

  React.useEffect(() => {
    router.push('/admin/dashboard')
  }, [router])
  
  return (
    <div>index</div>
  )
}

export default Index