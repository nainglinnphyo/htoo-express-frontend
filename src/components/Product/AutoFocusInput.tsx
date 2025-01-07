'use client'

import { TextInput, TextInputProps } from '@mantine/core';
import { useEffect, useRef } from 'react';

export function AutoFocusInput(props: TextInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	return <TextInput {...props} ref={inputRef} />;
}

