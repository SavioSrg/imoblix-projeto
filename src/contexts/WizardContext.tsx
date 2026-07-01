import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * WizardContext — motor genérico do assistente.
 *
 * Mantém, de forma desacoplada da UI:
 * - qual fluxo está ativo (id + título)
 * - a lista de steps declarados
 * - o step corrente
 * - as respostas acumuladas do usuário
 *
 * Persiste em sessionStorage para sobreviver a refresh e retorno via
 * botão "Voltar" do navegador.
 */

export interface WizardStepMeta {
  id: string;
  label: string;
  optional?: boolean;
}

export interface WizardFlow {
  id: string;
  title: string;
  intent?: string;
  steps: WizardStepMeta[];
}

export type WizardAnswers = Record<string, unknown>;

interface WizardState {
  flow: WizardFlow | null;
  currentStepIndex: number;
  answers: WizardAnswers;
  startedAt: string | null;
  status: "idle" | "in_progress" | "completed";
}

interface WizardContextValue extends WizardState {
  startFlow: (flow: WizardFlow, initialAnswers?: WizardAnswers) => void;
  setAnswer: (key: string, value: unknown) => void;
  patchAnswers: (values: WizardAnswers) => void;
  goToStep: (index: number) => void;
  next: (values?: WizardAnswers) => void;
  back: () => void;
  complete: () => void;
  reset: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  currentStep: WizardStepMeta | null;
}

const STORAGE_KEY = "imoblix.wizard.v1";

const defaultState: WizardState = {
  flow: null,
  currentStepIndex: 0,
  answers: {},
  startedAt: null,
  status: "idle",
};

const WizardContext = createContext<WizardContextValue | null>(null);

function loadState(): WizardState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...(JSON.parse(raw) as WizardState) };
  } catch {
    return defaultState;
  }
}

function saveState(state: WizardState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(defaultState);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const startFlow = useCallback((flow: WizardFlow, initialAnswers: WizardAnswers = {}) => {
    setState({
      flow,
      currentStepIndex: 0,
      answers: initialAnswers,
      startedAt: new Date().toISOString(),
      status: "in_progress",
    });
  }, []);

  const setAnswer = useCallback((key: string, value: unknown) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [key]: value } }));
  }, []);

  const patchAnswers = useCallback((values: WizardAnswers) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, ...values } }));
  }, []);

  const goToStep = useCallback((index: number) => {
    setState((prev) => {
      if (!prev.flow) return prev;
      const clamped = Math.max(0, Math.min(index, prev.flow.steps.length - 1));
      return { ...prev, currentStepIndex: clamped };
    });
  }, []);

  const next = useCallback((values?: WizardAnswers) => {
    setState((prev) => {
      if (!prev.flow) return prev;
      const nextIndex = Math.min(prev.currentStepIndex + 1, prev.flow.steps.length - 1);
      return {
        ...prev,
        answers: values ? { ...prev.answers, ...values } : prev.answers,
        currentStepIndex: nextIndex,
      };
    });
  }, []);

  const back = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStepIndex: Math.max(prev.currentStepIndex - 1, 0),
    }));
  }, []);

  const complete = useCallback(() => {
    setState((prev) => ({ ...prev, status: "completed" }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<WizardContextValue>(() => {
    const totalSteps = state.flow?.steps.length ?? 0;
    const currentStep = state.flow?.steps[state.currentStepIndex] ?? null;
    const progress =
      totalSteps > 0 ? Math.round(((state.currentStepIndex + 1) / totalSteps) * 100) : 0;
    return {
      ...state,
      startFlow,
      setAnswer,
      patchAnswers,
      goToStep,
      next,
      back,
      complete,
      reset,
      isFirstStep: state.currentStepIndex === 0,
      isLastStep: totalSteps > 0 && state.currentStepIndex === totalSteps - 1,
      progress,
      currentStep,
    };
  }, [state, startFlow, setAnswer, patchAnswers, goToStep, next, back, complete, reset]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard deve ser usado dentro de <WizardProvider>");
  return ctx;
}
