import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap'

interface HomeProps {
  onLogin: (user: string) => void
}

export default function Home({ onLogin }: HomeProps) {
  const navigate = useNavigate()
  
  // ========== ESTADOS PRINCIPALES ==========
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // ========== ESTADOS DE NAVEGACIÓN ==========
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  
  // ========== ESTADOS DE ERRORES ==========
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  // ========== ESTADOS PARA RECUPERAR CONTRASEÑA ==========
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // ========== ESTADOS PARA CREAR CUENTA ==========
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [createAccountPassword, setCreateAccountPassword] = useState('')
  const [confirmCreatePassword, setConfirmCreatePassword] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showCreateAccountPassword, setShowCreateAccountPassword] = useState(false)
  const [showConfirmCreatePassword, setShowConfirmCreatePassword] = useState(false)

  // ========== FUNCIÓN DE EVALUACIÓN DE CONTRASEÑA ==========
  const getPasswordStrength = (pwd: string) => {
    let score = 0
    let feedback = ''
    
    if (pwd.length >= 8) score += 25
    if (/[a-z]/.test(pwd)) score += 25
    if (/[A-Z]/.test(pwd)) score += 25
    if (/[0-9]/.test(pwd)) score += 15
    if (/[^A-Za-z0-9]/.test(pwd)) score += 10
    
    if (score < 40) {
      feedback = 'Débil'
      return { score, feedback, variant: 'danger' as const }
    } else if (score < 70) {
      feedback = 'Media'
      return { score, feedback, variant: 'warning' as const }
    } else {
      feedback = 'Fuerte'
      return { score, feedback, variant: 'success' as const }
    }
  }

  // ========== VALIDACIONES ==========
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'El correo electrónico o nombre de usuario es requerido'
    }
    
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateNewPassword = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Debe contener al menos una mayúscula, una minúscula y un número'
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCreateAccount = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }
    
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }
    
    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    }
    
    if (createAccountPassword.length < 8) {
      newErrors.createAccountPassword = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(createAccountPassword)) {
      newErrors.createAccountPassword = 'Debe contener al menos una mayúscula, una minúscula y un número'
    }
    
    if (createAccountPassword !== confirmCreatePassword) {
      newErrors.confirmCreatePassword = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ========== MANEJADORES DE EVENTOS ==========
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onLogin(emailOrUsername)
      navigate('/dashboard')
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailOrUsername.trim()) {
      setErrors({ emailOrUsername: 'Ingrese su correo electrónico' })
      return
    }
    alert('Se ha enviado un enlace de recuperación a su correo electrónico')
    setShowForgotPassword(false)
    setShowCreatePassword(true)
  }

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateNewPassword()) {
      alert('Contraseña actualizada exitosamente')
      setShowCreatePassword(false)
      setShowForgotPassword(false)
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateCreateAccount()) {
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
        setShowCreateAccount(false)
        setFirstName('')
        setLastName('')
        setEmail('')
        setUsername('')
        setCreateAccountPassword('')
        setConfirmCreatePassword('')
        setErrors({})
      }, 2000)
    }
  }

  // ========== CALCULAR FORTALEZA DE CONTRASEÑA ==========
  const passwordStrength = getPasswordStrength(
    showCreatePassword ? newPassword : 
    showCreateAccount ? createAccountPassword : 
    password
  )

  // ========== PANTALLA DE MENSAJE DE ÉXITO ==========
  if (showSuccessMessage) {
    return (
      <div className="login-container">
        <div className="d-flex justify-content-center align-items-center w-100">
          <div className="card shadow" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-body text-center p-5">
              <i className="bi bi-check-circle text-success" style={{ fontSize: '48px' }}></i>
              <h4 className="mt-3 text-success">¡Cuenta Creada!</h4>
              <p className="text-muted">Tu cuenta ha sido creada exitosamente.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ========== PANTALLA DE CREAR CUENTA ==========
  if (showCreateAccount) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-form-side">
            <div className="login-card">
              <div className="card">
                <div className="card-body p-0">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Crear Cuenta</h2>
                    <p className="text-muted">Regístrate para empezar</p>
                  </div>
                  
                  <Form onSubmit={handleCreateAccount}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        isInvalid={!!errors.firstName}
                        placeholder="Ingrese su nombre"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        isInvalid={!!errors.lastName}
                        placeholder="Ingrese su apellido"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email}
                        placeholder="usuario@ejemplo.com"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Nombre de Usuario</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        isInvalid={!!errors.username}
                        placeholder="nombre_usuario"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showCreateAccountPassword ? 'text' : 'password'}
                          value={createAccountPassword}
                          onChange={(e) => setCreateAccountPassword(e.target.value)}
                          isInvalid={!!errors.createAccountPassword}
                          placeholder="Ingrese su contraseña"
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="position-absolute end-0 top-0 h-100 border-0"
                          onClick={() => setShowCreateAccountPassword(!showCreateAccountPassword)}
                        >
                          {showCreateAccountPassword ? (
                            <i className="bi bi-eye-slash"></i>
                          ) : (
                            <i className="bi bi-eye"></i>
                          )}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {errors.createAccountPassword}
                      </Form.Control.Feedback>
                      {createAccountPassword && (
                        <div className="mt-2">
                          <small className="text-muted">Nivel de seguridad: {passwordStrength.feedback}</small>
                          <ProgressBar 
                            variant={passwordStrength.variant} 
                            now={passwordStrength.score} 
                            className="mt-1"
                            style={{ height: '6px' }}
                          />
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showConfirmCreatePassword ? 'text' : 'password'}
                          value={confirmCreatePassword}
                          onChange={(e) => setConfirmCreatePassword(e.target.value)}
                          isInvalid={!!errors.confirmCreatePassword}
                          placeholder="Confirme su contraseña"
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="position-absolute end-0 top-0 h-100 border-0"
                          onClick={() => setShowConfirmCreatePassword(!showConfirmCreatePassword)}
                        >
                          {showConfirmCreatePassword ? (
                            <i className="bi bi-eye-slash"></i>
                          ) : (
                            <i className="bi bi-eye"></i>
                          )}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmCreatePassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mb-3">
                      Crear Cuenta
                    </Button>
                    <Button 
                      variant="link" 
                      className="w-100 text-decoration-none"
                      onClick={() => setShowCreateAccount(false)}
                    >
                      Volver al Login
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <div className="login-image-side">
            <div className="login-image-content text-center">
              <img src="/logo2.png" alt="Crear Cuenta" className="img-fluid rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ========== PANTALLA DE RECUPERAR CONTRASEÑA ==========
  if (showForgotPassword) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Recuperar Contraseña</h3>
              <Form onSubmit={handleForgotPassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    isInvalid={!!errors.emailOrUsername}
                    placeholder="Ingrese su correo electrónico"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.emailOrUsername}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Enviar Enlace de Recuperación
                </Button>
                <Button 
                  variant="link" 
                  className="w-100 text-decoration-none"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Volver al Login
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ========== PANTALLA DE CREAR NUEVA CONTRASEÑA ==========
  if (showCreatePassword) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Crear Nueva Contraseña</h3>
              <Form onSubmit={handleCreatePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    isInvalid={!!errors.newPassword}
                    placeholder="Ingrese su nueva contraseña"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newPassword}
                  </Form.Control.Feedback>
                  {newPassword && (
                    <div className="mt-2">
                      <small className="text-muted">Nivel de seguridad: {passwordStrength.feedback}</small>
                      <ProgressBar 
                        variant={passwordStrength.variant} 
                        now={passwordStrength.score} 
                        className="mt-1"
                        style={{ height: '6px' }}
                      />
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Confirme su nueva contraseña"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Alert variant="info" className="small">
                  <strong>Requisitos de seguridad:</strong>
                  <ul className="mb-0 mt-1">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un número</li>
                  </ul>
                </Alert>
                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Actualizar Contraseña
                </Button>
                <Button 
                  variant="link" 
                  className="w-100 text-decoration-none"
                  onClick={() => {
                    setShowCreatePassword(false)
                    setShowForgotPassword(false)
                  }}
                >
                  Volver al Login
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ========== PANTALLA DE LOGIN ==========
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-image-side">
          <div className="login-image-content text-center">
            <img src="/logo.png" alt="Gestor de Gastos" className="img-fluid rounded" />
          </div>
        </div>
        <div className="login-form-side">
          <div className="login-card">
            <div className="card">
              <div className="card-body p-0">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Iniciar Sesión</h2>
                  <p className="text-muted">Accede a tu cuenta</p>
                </div>
            
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico o Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      isInvalid={!!errors.emailOrUsername}
                      placeholder="usuario@ejemplo.com o nombre_usuario"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.emailOrUsername}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!errors.password}
                        placeholder="Ingrese su contraseña"
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="position-absolute end-0 top-0 h-100 border-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <i className="bi bi-eye-slash"></i>
                        ) : (
                          <i className="bi bi-eye"></i>
                        )}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                    {password && (
                      <div className="mt-2">
                        <small className="text-muted">Nivel de seguridad: {passwordStrength.feedback}</small>
                        <ProgressBar 
                          variant={passwordStrength.variant} 
                          now={passwordStrength.score} 
                          className="mt-1"
                          style={{ height: '6px' }}
                        />
                      </div>
                    )}
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 mb-3">
                    Iniciar Sesión
                  </Button>

                  <div className="text-center">
                    <Button 
                      variant="link" 
                      className="text-decoration-none p-0 me-3"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                    <span className="text-muted">|</span>
                    <Button 
                      variant="link" 
                      className="text-decoration-none p-0 ms-3"
                      onClick={() => setShowCreateAccount(true)}
                    >
                      Crear cuenta
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
