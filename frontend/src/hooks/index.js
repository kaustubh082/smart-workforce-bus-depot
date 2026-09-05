import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useCountUp — animates a number from 0 to `target`
 * Triggers when the ref element enters the viewport
 */
export function useCountUp(target, duration = 1800) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
        };
        requestAnimationFrame(step);
    }, [started, target, duration]);

    return { count, ref };
}

/**
 * useScrollReveal — returns a ref that adds 'revealed' class on intersection
 */
export function useScrollReveal(options = {}) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) el.classList.add('revealed'); },
            { threshold: 0.15, ...options }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

/**
 * useRole — convenience hook
 */
export function useRole() {
    // Import inline to avoid circular dep
    return null; // Used via useAuth().isManager etc.
}

/**
 * useClickOutside — triggers callback when clicking outside ref element
 */
export function useClickOutside(ref, callback) {
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) callback();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, callback]);
}

/**
 * useLocalStorage — synced with localStorage
 */
export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch { return initialValue; }
    });

    const set = useCallback((val) => {
        setValue(val);
        localStorage.setItem(key, JSON.stringify(val));
    }, [key]);

    return [value, set];
}
