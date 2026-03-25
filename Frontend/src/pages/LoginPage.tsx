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
import { useLogin } from '@/hooks';
import '../styles/LoginPage.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending, isError, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="login-form">
      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Login failed. Please try again.'}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        placeholder="••••••••"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        variant="outlined"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isPending}
        className="login-form__submit-button"
      >
        {isPending ? 'Logging in...' : 'Login'}
      </Button>

      <Typography variant="body2" className="login-form__footer-text">
        Don't have an account?{' '}
        <MuiLink href="/register" underline="hover" className="login-form__footer-link">
          Register here
        </MuiLink>
      </Typography>
    </Box>
  );
}
