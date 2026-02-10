import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Key, Plus, Copy, Trash2, AlertTriangle, Check, Eye, EyeOff, BarChart3, Activity, Clock, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiKeys, useCreateApiKey, useRevokeApiKey, useDeleteApiKey } from "@/hooks/useApiKeys";
import { useApiKeyStats, useApiKeyUsage } from "@/hooks/useApiKeyUsage";
import { format } from "date-fns";

// Rate limits (should match edge function)
const RATE_LIMITS = {
  read: { limit: 10, window: "per second" },
  write: { limit: 2, window: "per second" },
};

const ApiKeysPage = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: apiKeys, isLoading } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const deleteApiKey = useDeleteApiKey();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, authLoading, navigate]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    const result = await createApiKey.mutateAsync({
      name: newKeyName.trim(),
      expiresAt: newKeyExpiry || undefined,
    });

    setGeneratedKey(result.plainKey);
    setNewKeyName("");
    setNewKeyExpiry("");
  };

  const handleCopyKey = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setGeneratedKey(null);
    setNewKeyName("");
    setNewKeyExpiry("");
    setShowKey(false);
  };

  const handleRevoke = async () => {
    if (keyToRevoke) {
      await revokeApiKey.mutateAsync(keyToRevoke);
      setKeyToRevoke(null);
    }
  };

  const handleDelete = async () => {
    if (keyToDelete) {
      await deleteApiKey.mutateAsync(keyToDelete);
      setKeyToDelete(null);
      if (selectedKeyId === keyToDelete) {
        setSelectedKeyId(null);
      }
    }
  };

  const getStatusBadge = (key: { is_active: boolean; expires_at: string | null }) => {
    if (!key.is_active) {
      return <Badge variant="destructive">Revoked</Badge>;
    }
    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage API keys for external integrations like n8n
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {generatedKey ? "Your New API Key" : "Generate API Key"}
              </DialogTitle>
              <DialogDescription>
                {generatedKey
                  ? "Copy this key now. It won't be shown again!"
                  : "Create a new API key for external access to your CMS."}
              </DialogDescription>
            </DialogHeader>

            {!generatedKey ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., n8n Production"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyExpiry">Expiration Date (Optional)</Label>
                  <Input
                    id="keyExpiry"
                    type="datetime-local"
                    value={newKeyExpiry}
                    onChange={(e) => setNewKeyExpiry(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm break-all font-mono">
                      {showKey ? generatedKey : "•".repeat(64)}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span className="text-sm">
                    Make sure to copy this key. You won't be able to see it again!
                  </span>
                </div>
              </div>
            )}

            <DialogFooter>
              {!generatedKey ? (
                <>
                  <Button variant="outline" onClick={handleCloseCreateDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim() || createApiKey.isPending}
                  >
                    {createApiKey.isPending ? "Generating..." : "Generate Key"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCloseCreateDialog}>
                    Done
                  </Button>
                  <Button onClick={handleCopyKey}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Key
                      </>
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rate Limits Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Read Rate Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{RATE_LIMITS.read.limit} req/sec</div>
            <p className="text-xs text-muted-foreground">GET requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Write Rate Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{RATE_LIMITS.write.limit} req/sec</div>
            <p className="text-xs text-muted-foreground">POST, PUT, DELETE, PATCH requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Info */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <h3 className="font-medium mb-2">How to use API Keys</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Include the API key in your requests using the <code className="bg-background px-1.5 py-0.5 rounded">x-api-key</code> header:
        </p>
        <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
{`curl -X GET "https://qjzhkgqvfmbdccxpwxtz.supabase.co/functions/v1/cms-api/posts" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
        </pre>
      </div>

      {/* API Keys Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys && apiKeys.length > 0 ? (
              apiKeys.map((key) => (
                <TableRow 
                  key={key.id} 
                  className={`cursor-pointer ${selectedKeyId === key.id ? 'bg-muted/50' : ''}`}
                  onClick={() => setSelectedKeyId(selectedKeyId === key.id ? null : key.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      {key.name}
                      {selectedKeyId === key.id && (
                        <BarChart3 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {key.key_prefix}...
                    </code>
                  </TableCell>
                  <TableCell>{getStatusBadge(key)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(key.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {key.last_used_at
                      ? format(new Date(key.last_used_at), "MMM d, yyyy HH:mm")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {key.expires_at
                      ? format(new Date(key.expires_at), "MMM d, yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {key.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setKeyToRevoke(key.id)}
                        >
                          Revoke
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setKeyToDelete(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No API keys yet. Generate your first key to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Usage Statistics Panel */}
      {selectedKeyId && (
        <ApiKeyUsagePanel 
          apiKeyId={selectedKeyId} 
          onClose={() => setSelectedKeyId(null)}
        />
      )}

      {/* Revoke Confirmation */}
      <AlertDialog open={!!keyToRevoke} onOpenChange={() => setKeyToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the API key. Any applications using this key will
              no longer be able to access the CMS API.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke}>Revoke Key</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the API key and all its usage data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Usage statistics panel component
function ApiKeyUsagePanel({ apiKeyId, onClose }: { apiKeyId: string; onClose: () => void }) {
  const { stats, isLoading } = useApiKeyStats(apiKeyId);
  const { data: recentUsage } = useApiKeyUsage(apiKeyId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading usage data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No usage data available for this API key yet.
        </CardContent>
      </Card>
    );
  }

  const successRate = stats.totalRequests > 0 
    ? Math.round((stats.successfulRequests / stats.totalRequests) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            API Key Usage Statistics
          </CardTitle>
          <CardDescription>
            Monitoring data for the selected API key
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-2xl font-bold">{stats.requestsToday.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
            <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">{successRate}%</p>
          </div>
        </div>

        {/* Success Rate Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Success vs Failed Requests</span>
            <span className="text-muted-foreground">
              {stats.successfulRequests} success / {stats.failedRequests} failed
            </span>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>

        {/* Requests by Method */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">By HTTP Method</h4>
            <div className="space-y-1">
              {Object.entries(stats.requestsByMethod).map(([method, count]) => (
                <div key={method} className="flex justify-between text-sm">
                  <Badge variant="outline">{method}</Badge>
                  <span>{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">By Endpoint</h4>
            <div className="space-y-1">
              {Object.entries(stats.requestsByEndpoint).slice(0, 5).map(([endpoint, count]) => (
                <div key={endpoint} className="flex justify-between text-sm">
                  <code className="text-xs truncate max-w-[150px]">{endpoint}</code>
                  <span>{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        {recentUsage && recentUsage.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Requests</h4>
            <ScrollArea className="h-48 border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Time</TableHead>
                    <TableHead className="text-xs">Method</TableHead>
                    <TableHead className="text-xs">Endpoint</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsage.slice(0, 20).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(record.created_at), "HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{record.method}</Badge>
                      </TableCell>
                      <TableCell className="text-xs truncate max-w-[150px]">
                        {record.endpoint}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={record.status_code && record.status_code < 400 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {record.status_code || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {record.response_time_ms ? `${record.response_time_ms}ms` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ApiKeysPage;
