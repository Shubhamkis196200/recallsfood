import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Invitation {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  expires_at: string;
  accepted_at: string | null;
}

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid invitation link. No token provided.');
        setLoading(false);
        return;
      }

      try {
        // Hash the token to compare with stored hash
        const encoder = new TextEncoder();
        const data = encoder.encode(token);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const { data: inviteData, error: inviteError } = await supabase
          .from('user_invitations')
          .select('*')
          .eq('token_hash', tokenHash)
          .single();

        if (inviteError || !inviteData) {
          setError('Invalid or expired invitation link.');
          setLoading(false);
          return;
        }

        if (inviteData.accepted_at) {
          setError('This invitation has already been used.');
          setLoading(false);
          return;
        }

        if (new Date(inviteData.expires_at) < new Date()) {
          setError('This invitation has expired.');
          setLoading(false);
          return;
        }

        setInvitation(inviteData as Invitation);
      } catch (err) {
        setError('Failed to validate invitation.');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (!invitation || !token) return;

    setIsSubmitting(true);

    try {
      // Call edge function to accept invitation and create user
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'accept_invitation',
          token,
          password,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'Account Created!',
        description: 'Your account has been created. You can now log in.',
      });

      navigate('/auth');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create account.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-serif text-2xl mb-2">Invalid Invitation</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-serif text-3xl mb-2">Welcome to LUXE EDITORIAL</h1>
          <p className="text-muted-foreground">
            You've been invited as <span className="font-semibold capitalize">{invitation?.role}</span>
          </p>
        </div>

        <div className="border border-border p-8 bg-card">
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="text-muted-foreground">Email:</span>{' '}
              <span className="font-medium">{invitation?.email}</span>
            </p>
            {invitation?.full_name && (
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Name:</span>{' '}
                <span className="font-medium">{invitation.full_name}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Create Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Password strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="mt-1"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || password !== confirmPassword || password.length < 8}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
