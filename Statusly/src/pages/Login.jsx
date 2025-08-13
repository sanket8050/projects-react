import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { AuthContext } from '../context/AuthContext.jsx'
import { signUp, signIn } from '../services/firebase.jsx'

export default function Login() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  if (user) {
    navigate(user.role === 'owner' ? '/owner' : '/')
    return null
  }

  const onSubmit = async (data) => {
    try {
      if (isSignUp) {
        await signUp(data.email, data.password, data.name, data.role)
      } else {
        await signIn(data.email, data.password)
      }
      navigate(data.role === 'owner' ? '/owner' : '/')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isSignUp ? 'Sign Up' : 'Login'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <div>
                <Input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
            )}
            <div>
              <Input
                {...register('email', { required: 'Email is required' })}
                placeholder="Email"
                type="email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Input
                {...register('password', { required: 'Password is required' })}
                placeholder="Password"
                type="password"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {isSignUp && (
              <div>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="w-full p-2 border rounded"
                >
                  <option value="customer">Customer</option>
                  <option value="owner">Owner</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
              </div>
            )}
            <Button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}