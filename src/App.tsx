import { useState } from 'react'
import { ACTIVE_ROLE_STORAGE_KEY, isSystemRole, systemRoles, type SystemRole } from './roles/roles'
import { WaiterWorkspace } from './roles/WaiterWorkspace'
import { KitchenWorkspace } from './roles/KitchenWorkspace'
import './App.css'

function getStoredRole(): SystemRole | null {
  try {
    const value = window.localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY)
    return isSystemRole(value) ? value : null
  } catch {
    return null
  }
}

function RoleLogin({ onLogin }: { onLogin: (role: SystemRole) => void }) {
  const [selectedRole, setSelectedRole] = useState<SystemRole>('waiter')

  return (
    <main className="role-login-screen">
      <section className="role-login-card" aria-labelledby="role-login-title">
        <div className="role-login-brand">
          <span className="role-login-mark" aria-hidden="true">f.</span>
          <div><strong>Franczesko</strong><span>RESTAURANT</span></div>
        </div>
        <span className="role-login-eyebrow">PANEL PERSONELU</span>
        <h1 id="role-login-title">Witaj w restauracji</h1>
        <p className="role-login-intro">Wybierz rolę, aby przejść do odpowiedniego obszaru systemu.</p>

        <fieldset className="role-picker">
          <legend>Wybierz rolę w systemie</legend>
          {systemRoles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={selectedRole === role.id ? 'role-option role-option-selected' : 'role-option'}
              aria-pressed={selectedRole === role.id}
              disabled={!role.available}
              onClick={() => setSelectedRole(role.id)}
            >
              <span className={`role-option-icon role-option-icon-${role.id}`} aria-hidden="true">{role.id === 'waiter' ? (
                <svg viewBox="0 0 48 48" focusable="false"><path d="M15 8h18v5H15zM12 17h24v22H12z" /><path d="M17 22h14M17 28h9M17 34h6" /></svg>
              ) : (
                <svg viewBox="0 0 48 48" focusable="false"><path d="M10 35h28M14 35V20h20v15M18 20v-7h12v7M19 13V9h10v4" /><path d="M20 26h8M24 22v8" /></svg>
              )}</span>
              <span className="role-option-copy"><strong>{role.label}</strong><small>{role.description}</small></span>
              <span className="role-option-check" aria-hidden="true">{selectedRole === role.id ? '✓' : ''}</span>
            </button>
          ))}
        </fieldset>

        <button className="checkout-button role-login-submit" type="button" onClick={() => onLogin(selectedRole)}>
          Zaloguj jako {systemRoles.find((role) => role.id === selectedRole)?.label ?? 'użytkownik'}
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  )
}

function App() {
  const [activeRole, setActiveRole] = useState<SystemRole | null>(getStoredRole)

  const login = (role: SystemRole) => {
    try {
      window.localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role)
    } catch {
      // Sesja pozostanie aktywna do odświeżenia strony, nawet bez localStorage.
    }
    setActiveRole(role)
  }

  const logout = () => {
    try {
      window.localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY)
    } catch {
      // Wylogowanie w bieżącej karcie nadal działa.
    }
    setActiveRole(null)
  }

  if (!activeRole) return <RoleLogin onLogin={login} />

  switch (activeRole) {
    case 'waiter':
      return <WaiterWorkspace onLogout={logout} />
    case 'kitchen':
      return <KitchenWorkspace onLogout={logout} />
    default:
      return <RoleLogin onLogin={login} />
  }
}

export default App
