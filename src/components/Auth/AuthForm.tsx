import { Button, Card, Input } from '@nextui-org/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { useState } from 'react';

import Icon from '../Icon';

interface Data {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  title: string;
  error: string;
  buttonText: string;
  onSubmit: (data: Data) => void;
  linkText: string;
  linkDescription: string;
  linkHref: string;
  isFullForm?: boolean;
}

export default function AuthForm({
  title,
  error,
  buttonText,
  onSubmit,
  linkText,
  linkHref,
  linkDescription,
  isFullForm = true,
}: AuthFormProps) {
  const t = useTranslations('AuthForm');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [isVisible, setIsVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className="w-full max-w-[450px] p-4">
      <form
        onSubmit={handleFormSubmit}
        className="flex w-full flex-col items-center gap-2"
      >
        <h1 className="pb-4 text-2xl font-semibold">{title}</h1>
        {isFullForm && (
          <div className="flex w-full gap-2">
            <Input
              className="w-1/2"
              type="text"
              label="First name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
            <Input
              className="w-1/2"
              type="text"
              label="Last name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <Input
          className="w-full"
          type="email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <Input
          className="w-full"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          type={isVisible ? 'text' : 'password'}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <Icon name="eyeSlashFilled" />
              ) : (
                <Icon name="eyeFilled" />
              )}
            </button>
          }
        />

        {error && <p className="text-danger-500">{error}</p>}
        <div className="flex w-full justify-end">
          {!isFullForm && (
            <Link
              href="/request-reset-password"
              className="text-sm hover:text-blue-500 hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          )}
        </div>

        <Button
          type="submit"
          color="primary"
          isLoading={isLoading}
          isDisabled={
            isLoading || formData.email === '' || formData.password === ''
          }
          className="w-full"
        >
          {buttonText}
        </Button>
        <p className="text-sm">
          {linkDescription}
          <Link
            href={linkHref}
            className="text-sm hover:text-blue-500 hover:underline"
          >
            {linkText}
          </Link>
        </p>
      </form>
    </Card>
  );
}
