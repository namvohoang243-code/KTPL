import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 select-none">
          <div className="surface max-w-lg w-full rounded-3xl p-8 border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0a1128]/95 shadow-2xl text-center backdrop-blur-xl">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-5">
              <AlertTriangle className="h-8 w-8" />
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Đã có lỗi nhỏ xảy ra khi tải dữ liệu
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Dữ liệu hiển thị đang được đồng bộ lại. Bạn có thể nhấn tải lại trang để tiếp tục sử dụng.
            </p>

            {this.state.error && (
              <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 text-left text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-cobalt-600 px-6 py-3 text-sm font-bold text-white shadow-glow-cobalt hover:bg-cobalt-500 transition cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Tải lại trang
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Về Trang chủ
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
