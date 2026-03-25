import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Link as MuiLink,
  Typography,
  Alert,
} from '@mui/material';
import { useRegister } from '@/hooks';
import '../styles/RegisterPage.css';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register, isPending, isError, error } = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    register({
      email: data.email,
      password: data.password,
      name: data.name,
    }, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="register-form">
      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Registration failed. Please try again.'}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Full Name"
        type="text"
        placeholder="John Doe"
        {...registerField('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...registerField('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        placeholder="••••••••"
        {...registerField('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        {...registerField('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        variant="outlined"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isPending}
        className="register-form__submit-button"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </Button>

      <Typography variant="body2" className="register-form__footer-text">
        Already have an account?{' '}
        <MuiLink href="/login" underline="hover" className="register-form__footer-link">
          Login here
        </MuiLink>
      </Typography>
    </Box>
  );
}
