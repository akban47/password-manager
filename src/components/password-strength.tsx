export function calculatePasswordStrength(password: string) {
    let score = 0;
    if (password.length >= 12) score += 2
    else if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    if (/(.)\1{2,}/.test(password)) score -= 1
    if (password.length > 14) score += 1 
    return Math.max(0, Math.min(5, score));
  }
  
  interface PasswordStrengthProps {
    password: string;
  }
  
  export function PasswordStrength({ password }: PasswordStrengthProps) {
    const strength = calculatePasswordStrength(password);
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-400',
      'bg-green-600'
    ];
    const labels = [
      'Very Weak',
      'Weak',
      'Fair',
      'Strong',
      'Very Strong'
    ];
  
    return (
      <div className="w-full space-y-2">
        <div className="flex gap-1 h-1.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 rounded-full transition-colors ${
                i < strength ? colors[strength - 1] : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Strength: {labels[strength - 1] || 'Too Weak'}
        </p>
      </div>
    );
  }