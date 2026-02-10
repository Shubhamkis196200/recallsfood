import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailSettings, useSaveEmailSettings, useTestEmailSettings } from '@/hooks/useEmailSettings';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Mail, Send, Loader2, ShieldCheck } from 'lucide-react';

const EmailSettingsPage = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const { data: settings, isLoading } = useEmailSettings();
  const saveSettings = useSaveEmailSettings();
  const testEmail = useTestEmailSettings();
  const { toast } = useToast();

  const [provider, setProvider] = useState('resend');
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  useEffect(() => {
    if (settings) {
      setProvider(settings.provider || 'resend');
      setFromEmail(settings.from_email || '');
      setFromName(settings.from_name || '');
      setSmtpHost(settings.smtp_host || '');
      setSmtpPort(settings.smtp_port?.toString() || '587');
      setSmtpUser(settings.smtp_user || '');
      setIsActive(settings.is_active || false);
    }
  }, [settings]);

  if (authLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSave = async () => {
    try {
      await saveSettings.mutateAsync({
        provider,
        from_email: fromEmail || null,
        from_name: fromName || null,
        smtp_host: provider === 'smtp' ? smtpHost : null,
        smtp_port: provider === 'smtp' ? parseInt(smtpPort) : null,
        smtp_user: provider === 'smtp' ? smtpUser : null,
        is_active: isActive,
      });

      toast({
        title: 'Settings Saved',
        description: 'Email settings have been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save email settings.',
        variant: 'destructive',
      });
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddress) {
      toast({
        title: 'Error',
        description: 'Please enter a test email address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await testEmail.mutateAsync(testEmailAddress);
      toast({
        title: 'Test Email Sent',
        description: `A test email has been sent to ${testEmailAddress}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send test email.',
        variant: 'destructive',
      });
    }
  };

  const getApiKeyHelp = () => {
    switch (provider) {
      case 'resend':
        return 'Set EMAIL_API_KEY in Cloud Secrets. Get your key from resend.com/api-keys';
      case 'sendgrid':
        return 'Set EMAIL_API_KEY in Cloud Secrets. Get your key from sendgrid.com → Settings → API Keys';
      case 'brevo':
        return 'Set EMAIL_API_KEY in Cloud Secrets. Get your key from brevo.com → SMTP & API → API Keys';
      case 'instantly':
        return 'Set EMAIL_API_KEY in Cloud Secrets. Get your key from app.instantly.ai → Settings → Integrations → API';
      default:
        return '';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading email settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Email Settings</h1>
          <p className="text-muted-foreground">Configure email provider for sending invitations and notifications</p>
        </div>
        <Mail className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Provider Selection */}
      <div className="border border-border rounded-lg p-6 space-y-4">
        <h2 className="font-bold text-xl">Email Provider</h2>
        
        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resend">Resend</SelectItem>
              <SelectItem value="sendgrid">SendGrid</SelectItem>
              <SelectItem value="brevo">Brevo (Sendinblue)</SelectItem>
              <SelectItem value="instantly">Instantly</SelectItem>
              <SelectItem value="smtp">Custom SMTP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="noreply@yourdomain.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="RecallsFood"
            />
          </div>
        </div>

        {/* API Key info for Resend/SendGrid/Brevo/Instantly */}
        {provider !== 'smtp' && (
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <Label className="font-medium">API Key (Secured)</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              API key is securely stored in Cloud Secrets as <code className="bg-muted px-1.5 py-0.5 rounded text-xs">EMAIL_API_KEY</code>
            </p>
            <p className="text-xs text-muted-foreground">{getApiKeyHelp()}</p>
          </div>
        )}

        {/* SMTP Settings - Not Supported */}
        {provider === 'smtp' && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              SMTP is not yet supported. Please use Resend, SendGrid, Brevo, or Instantly.
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="isActive">Enable email sending</Label>
        </div>

        <Button onClick={handleSave} disabled={saveSettings.isPending}>
          {saveSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>

      {/* Test Email */}
      <div className="border border-border rounded-lg p-6 space-y-4">
        <h2 className="font-bold text-xl">Test Email</h2>
        <p className="text-sm text-muted-foreground">Send a test email to verify your configuration</p>
        
        <div className="flex gap-4">
          <Input
            type="email"
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
            placeholder="test@example.com"
            className="flex-1"
          />
          <Button onClick={handleTestEmail} disabled={testEmail.isPending || !isActive}>
            {testEmail.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Test
          </Button>
        </div>
        {!isActive && (
          <p className="text-sm text-amber-600">Enable email sending above to test your configuration</p>
        )}
      </div>
    </div>
  );
};

export default EmailSettingsPage;
