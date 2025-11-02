"use client";

import { Brain, Sparkles, Zap, Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateAIPreferences, updateAPIKeys } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AISettingsProps {
  user: {
    _id: string;
    preferences?: {
      aiProvider?: string;
      theme?: string;
    };
    apiKeys?: {
      gemini?: string;
      openai?: string;
      anthropic?: string;
    };
  };
}

const aiProviders = [
  {
    value: "gemini",
    label: "Google Gemini",
    icon: Sparkles,
    description:
      "Google's advanced AI model with strong reasoning capabilities",
  },
  {
    value: "openai",
    label: "OpenAI GPT",
    icon: Brain,
    description: "OpenAI's GPT models for general-purpose AI tasks",
  },
  {
    value: "anthropic",
    label: "Anthropic Claude",
    icon: Zap,
    description: "Anthropic's Claude for safe and helpful AI assistance",
  },
];

export function AISettings({ user }: AISettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(
    user.preferences?.aiProvider || "gemini",
  );
  const [apiKeys, setApiKeys] = useState({
    gemini: user.apiKeys?.gemini || "",
    openai: user.apiKeys?.openai || "",
    anthropic: user.apiKeys?.anthropic || "",
  });
  const [showKeys, setShowKeys] = useState({
    gemini: false,
    openai: false,
    anthropic: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("aiProvider", selectedProvider);

      const result = await updateAIPreferences(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("AI preferences updated successfully!");
      }
    } catch {
      toast.error("Failed to update AI preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAPIKeysSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingKeys(true);

    try {
      const formData = new FormData();
      formData.append("gemini", apiKeys.gemini);
      formData.append("openai", apiKeys.openai);
      formData.append("anthropic", apiKeys.anthropic);

      const result = await updateAPIKeys(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("API keys updated successfully!");
      }
    } catch {
      toast.error("Failed to update API keys");
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const handleAPIKeyChange = (provider: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Selection</CardTitle>
          <CardDescription>
            Choose which AI provider powers your validations and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="aiProvider">Current AI Provider</Label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
                disabled={isLoading}
              >
                <SelectTrigger id="aiProvider">
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  {aiProviders.map((provider) => {
                    const Icon = provider.icon;
                    return (
                      <SelectItem key={provider.value} value={provider.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{provider.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Provider Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {aiProviders.map((provider) => {
                const Icon = provider.icon;
                const isSelected = selectedProvider === provider.value;
                return (
                  <button
                    key={provider.value}
                    type="button"
                    onClick={() => setSelectedProvider(provider.value)}
                    disabled={isLoading}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{provider.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {provider.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>
            Information about your AI usage and rate limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Current Provider</span>
              <span className="text-sm text-muted-foreground">
                {aiProviders.find((p) => p.value === selectedProvider)?.label}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Monthly Credits</span>
              <span className="text-sm text-muted-foreground">Unlimited</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Response Quality</span>
              <span className="text-sm text-muted-foreground">
                High (optimized)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Add your own API keys to use custom AI providers (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAPIKeysSubmit} className="space-y-6">
            <Alert>
              <AlertDescription>
                Your API keys are encrypted and stored securely. Leaving a key empty will use our default keys.
              </AlertDescription>
            </Alert>

            {aiProviders.map((provider) => {
              const Icon = provider.icon;
              const providerKey = apiKeys[provider.value as keyof typeof apiKeys];
              const showKey = showKeys[provider.value as keyof typeof showKeys];
              
              return (
                <div key={provider.value} className="space-y-2">
                  <Label htmlFor={`key-${provider.value}`} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {provider.label} API Key
                  </Label>
                  <div className="relative">
                    <Input
                      id={`key-${provider.value}`}
                      type={showKey ? "text" : "password"}
                      placeholder={`Enter your ${provider.label} API key`}
                      value={providerKey}
                      onChange={(e) => handleAPIKeyChange(provider.value, e.target.value)}
                      disabled={isLoadingKeys}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowKeys((prev) => ({ ...prev, [provider.value]: !showKey }))}
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isLoadingKeys}>
                {isLoadingKeys ? "Saving..." : "Save API Keys"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
