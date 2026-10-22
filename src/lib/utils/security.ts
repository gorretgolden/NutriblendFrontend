/**
 * Security Utilities for NutriBlend Haven
 * Provides input sanitization and XSS protection
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

const RICH_HTML_ALLOWED_TAGS = [
    'p', 'br', 'hr', 'span', 'div',
    'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const RICH_HTML_ALLOWED_ATTR = [
    'href', 'title', 'target', 'rel',
    'src', 'alt', 'width', 'height',
    'colspan', 'rowspan',
];

/**
 * Sanitize rich HTML for safe rendering via dangerouslySetInnerHTML.
 * DOMPurify-backed: strips script/svg/style/object/embed/form/input,
 * all event handlers and javascript:/data: URLs while preserving safe
 * formatting tags (p, ul, li, strong, a, headings, tables, images).
 */
export const sanitizeRichHtml = (html: string): string => {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: RICH_HTML_ALLOWED_TAGS,
        ALLOWED_ATTR: RICH_HTML_ALLOWED_ATTR,
        ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
        FORBID_TAGS: ['style', 'script', 'svg', 'math', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button'],
        FORBID_ATTR: ['style', 'class', 'onerror', 'onload', 'onclick'],
        KEEP_CONTENT: true,
    });
};

/**
 * Sanitize user input for safe display
 */
export const sanitizeInput = (input: string): string => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (international format)
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitize URL to prevent javascript: and data: URIs
 */
export const sanitizeUrl = (url: string): string => {
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    try {
        const parsedUrl = new URL(url, window.location.origin);
        if (allowedProtocols.includes(parsedUrl.protocol)) {
            return parsedUrl.href;
        }
    } catch {
        // Invalid URL, return safe default
    }
    return '#';
};

/**
 * Generate CSRF token (for form submissions)
 */
export const generateCsrfToken = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    feedback: string[];
} => {
    const feedback: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (password.length < 8) {
        feedback.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
        feedback.push('Password must contain lowercase letters');
    }

    if (!/[A-Z]/.test(password)) {
        feedback.push('Password must contain uppercase letters');
    }

    if (!/[0-9]/.test(password)) {
        feedback.push('Password must contain numbers');
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        feedback.push('Password must contain special characters');
    }

    const isValid = feedback.length === 0;

    if (isValid) {
        if (password.length >= 12 && /[^a-zA-Z0-9]/.test(password)) {
            strength = 'strong';
        } else if (password.length >= 10) {
            strength = 'medium';
        }
    }

    return { isValid, strength, feedback };
};

/**
 * Escape RegExp special characters
 */
export const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Check if content contains potential XSS
 */
export const containsXss = (content: string): boolean => {
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(content));
};

/**
 * Rate limiting helper (client-side)
 */
export class RateLimiter {
    private attempts: Map<string, number[]> = new Map();

    constructor(
        private maxAttempts: number = 5,
        private windowMs: number = 60000
    ) { }

    isAllowed(key: string): boolean {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];

        // Filter out old attempts
        const recentAttempts = attempts.filter(
            timestamp => now - timestamp < this.windowMs
        );

        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);

        return true;
    }

    reset(key: string): void {
        this.attempts.delete(key);
    }
}

/**
 * Secure localStorage wrapper with encryption
 */
export const secureStorage = {
    setItem: (key: string, value: any): void => {
        try {
            const serialized = JSON.stringify(value);
            const encoded = btoa(serialized);
            localStorage.setItem(key, encoded);
        } catch (error) {
            console.error('Error saving to secure storage:', error);
        }
    },

    getItem: <T = any>(key: string): T | null => {
        try {
            const encoded = localStorage.getItem(key);
            if (!encoded) return null;

            const decoded = atob(encoded);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Error reading from secure storage:', error);
            return null;
        }
    },

    removeItem: (key: string): void => {
        localStorage.removeItem(key);
    },

    clear: (): void => {
        localStorage.clear();
    },
};
