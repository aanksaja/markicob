import React, { useState } from 'react'; // Ensure useState is imported
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authService } from '~/services/authService'; // Adjust the import path as necessary

const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);


const LoginPage = () => {
  // CORRECTED: useState and handleChange are now inside the functional component
  const [formData, setFormData] = useState({
    username: '', // Corrected name to match the input if it's for email
    password: ''
  });

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('Login form submitted:', formData);
    // Here you would integrate your authService.login(formData)
    // Example:
    // authService.login(formData)
    //   .then(token => {
    //     console.log('Login successful, token:', token);
    //     // Redirect user to home page or dashboard
    //   })
    //   .catch(error => {
    //     console.error('Login failed:', error);
    //     // Display error message to user
    //   });

    setError('');
    setIsLoading(true);
    
    try {
      const response = await authService.login(formData);
      console.log('Login response:', response); // Debug log
      // Handle successful login here, e.g., redirect or show a message
      // Example: window.location.href = '/dashboard';
      // Remove or replace the following lines as needed:
      // onLoginSuccess(response);
      // onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* Changed form to use onSubmit */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username_or_email">Email / Username</Label>
                <Input
                  id="username_or_email"
                  name="username_or_email" // Added name attribute
                  type="text" // Changed type to text, as it could be username or email
                  placeholder="m@example.com or username"
                  required
                  value={formData.username} // Controlled component
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password" // Added name attribute
                  type="password"
                  required
                  value={formData.password} // Controlled component
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Moved submit button inside the form for proper submission */}
            <CardFooter className="flex-col gap-2 pt-6"> {/* Added pt-6 for spacing */}
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        {/* Removed CardFooter from outside the form if it was for submission buttons */}
      </Card>
    </div>
  );
};

export default LoginPage;
