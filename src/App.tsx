// ========== IMPORTS ==========
// Importaciones de React y componentes necesarios
import { useState } from 'react'
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  // ========== ESTADOS PRINCIPALES ==========
  // Estado para controlar si el usuario está logueado
  const [user, setUser] = useState<string | null>(null)
  
  // ========== ESTADOS DEL LOGIN ==========
  // Campos del formulario de login
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // Para mostrar/ocultar contraseña
  
  // ========== ESTADOS DE NAVEGACIÓN ==========
  // Controlan qué pantalla mostrar
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  
  // ========== ESTADOS DE ERRORES ==========
  // Almacena mensajes de error de validación
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  // ========== ESTADOS PARA RECUPERAR CONTRASEÑA ==========
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // ========== ESTADOS PARA CREAR CUENTA ==========
  // Campos del formulario de registro
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
  // Calcula la fortaleza de la contraseña basada en diferentes criterios
  const getPasswordStrength = (pwd: string) => {
    let score = 0
    let feedback = ''
    
    // Criterios de evaluación (puntuación sobre 100)
    if (pwd.length >= 8) score += 25        // Longitud mínima
    if (/[a-z]/.test(pwd)) score += 25       // Letras minúsculas
    if (/[A-Z]/.test(pwd)) score += 25       // Letras mayúsculas
    if (/[0-9]/.test(pwd)) score += 15       // Números
    if (/[^A-Za-z0-9]/.test(pwd)) score += 10 // Caracteres especiales
    
    // Clasificación de la fortaleza
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

  // ========== VALIDACIÓN DEL FORMULARIO DE LOGIN ==========
  // Valida que los campos de login no estén vacíos
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    // Validar campo de email/usuario
    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'El correo electrónico o nombre de usuario es requerido'
    }
    
    // Validar campo de contraseña
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    }
    
    // Actualizar errores y retornar si es válido
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ========== VALIDACIÓN PARA NUEVA CONTRASEÑA ==========
  // Valida la nueva contraseña en el proceso de recuperación
  const validateNewPassword = () => {
    const newErrors: { [key: string]: string } = {}
    
    // Validar longitud mínima
    if (newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    // Validar complejidad (mayúscula, minúscula, número)
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Debe contener al menos una mayúscula, una minúscula y un número'
    }
    
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ========== VALIDACIÓN PARA CREAR CUENTA ==========
  // Valida todos los campos del formulario de registro
  const validateCreateAccount = () => {
    const newErrors: { [key: string]: string } = {}
    
    // Validar nombre
    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }
    
    // Validar apellido
    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }
    
    // Validar email (requerido y formato)
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }
    
    // Validar nombre de usuario
    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    }
    
    // Validar longitud de contraseña
    if (createAccountPassword.length < 8) {
      newErrors.createAccountPassword = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    // Validar complejidad de contraseña
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(createAccountPassword)) {
      newErrors.createAccountPassword = 'Debe contener al menos una mayúscula, una minúscula y un número'
    }
    
    // Validar que las contraseñas coincidan
    if (createAccountPassword !== confirmCreatePassword) {
      newErrors.confirmCreatePassword = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ========== MANEJADORES DE EVENTOS ==========
  
  // Maneja el envío del formulario de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault() // Prevenir recarga de página
    if (validateForm()) {
      setUser(emailOrUsername) // Establecer usuario logueado
    }
  }

  // Maneja el proceso de recuperación de contraseña
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Validar que se ingresó un email
    if (!emailOrUsername.trim()) {
      setErrors({ emailOrUsername: 'Ingrese su correo electrónico' })
      return
    }
    // Simular envío de email y navegar a crear nueva contraseña
    alert('Se ha enviado un enlace de recuperación a su correo electrónico')
    setShowForgotPassword(false)
    setShowCreatePassword(true)
  }

  // Maneja la creación de nueva contraseña
  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateNewPassword()) {
      alert('Contraseña actualizada exitosamente')
      // Volver al login principal
      setShowCreatePassword(false)
      setShowForgotPassword(false)
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  // Maneja la creación de nueva cuenta
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateCreateAccount()) {
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
        setShowCreateAccount(false)
        // Limpiar todos los campos del formulario de crear cuenta
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

  // Maneja el cierre de sesión y limpia todos los estados
  const handleLogout = () => {
    setUser(null) // Desloguear usuario
    // Limpiar todos los campos y estados
    setEmailOrUsername('')
    setPassword('')
    setErrors({})
    setShowForgotPassword(false)
    setShowCreatePassword(false)
    setShowCreateAccount(false)
    setFirstName('')
    setLastName('')
    setEmail('')
    setUsername('')
    setCreateAccountPassword('')
    setConfirmCreatePassword('')
  }

  // ========== LÓGICA PRINCIPAL DE RENDERIZADO ==========
  
  // Calcular fortaleza de contraseña según la pantalla activa
  const passwordStrength = getPasswordStrength(
    showCreatePassword ? newPassword : 
    showCreateAccount ? createAccountPassword : 
    password
  )

  // ========== RENDERIZADO CONDICIONAL ==========
  // Si no hay usuario logueado, mostrar pantallas de autenticación
  if (!user) {
    // ========== PANTALLA DE MENSAJE DE ÉXITO ==========
    if (showSuccessMessage) {
      return (
        <div className="login-container">
          <div className="d-flex justify-content-center align-items-center w-100">
            <div className="card shadow" style={{ maxWidth: '400px', width: '100%' }}>
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <svg width="64" height="64" fill="#28a745" viewBox="0 0 16 16" className="mb-3">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                </div>
                <h3 className="text-success fw-bold mb-0">¡Cuenta creada exitosamente!</h3>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // ========== PANTALLA DE CREAR CUENTA ==========
    // Formulario de registro con diseño invertido (formulario izquierda, imagen derecha)
    if (showCreateAccount) {
      return (
        <div className="login-container"> {/* Contenedor principal de pantalla completa */}
          <div className="login-wrapper"> {/* Wrapper de la tarjeta flotante */}
            {/* LADO IZQUIERDO: Formulario de registro */}
            <div className="login-form-side">
              <div className="login-card">
                <div className="card">
                  <div className="card-body p-0">
                    {/* Título de la sección */}
                    <div className="text-center mb-4">
                      <h2 className="fw-bold text-primary">Crear Cuenta</h2>
                      <p className="text-muted">Regístrate para comenzar</p>
                    </div>
                    
                    <Form onSubmit={handleCreateAccount}>
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              isInvalid={!!errors.firstName}
                              placeholder="Tu nombre"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.firstName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              isInvalid={!!errors.lastName}
                              placeholder="Tu apellido"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.lastName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          isInvalid={!!errors.email}
                          placeholder="tu@ejemplo.com"
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
                            placeholder="Crea una contraseña segura"
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="position-absolute end-0 top-0 h-100 border-0"
                            onClick={() => setShowCreateAccountPassword(!showCreateAccountPassword)}
                          >
                            {showCreateAccountPassword ? (
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.708zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                              </svg>
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
                            placeholder="Confirma tu contraseña"
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="position-absolute end-0 top-0 h-100 border-0"
                            onClick={() => setShowConfirmCreatePassword(!showConfirmCreatePassword)}
                          >
                            {showConfirmCreatePassword ? (
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.708zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                              </svg>
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
                      
                      <div className="text-center">
                        <Button 
                          variant="link" 
                          className="text-decoration-none p-0"
                          onClick={() => setShowCreateAccount(false)}
                        >
                          ¿Ya tienes cuenta? Inicia sesión
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            <div className="login-image-side">
              <div className="login-image-content text-center">
                {/* imagen para crear cuenta */}
                <img src="/logo2.png" alt="Crear Cuenta" className="img-fluid rounded" />
              </div>
            </div>
          </div>
        </div>
      )
    }

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

    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-image-side">
            <div className="login-image-content text-center">
              {/* Aquí puedes agregar tu imagen */}
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
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.708zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
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

  // ========== PANTALLA PRINCIPAL (USUARIO LOGUEADO) ==========
  // Dashboard principal que se muestra después del login exitoso
  return (
    <div className="container-fluid">
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
        <div className="container">
          {/* Logo/Título de la aplicación */}
          <span className="navbar-brand h1 mb-0 text-primary">Gestor de Gastos</span>
          {/* Sección de usuario y logout */}
          <div className="d-flex align-items-center">
            <span className="me-3">Hola, {user}</span>
            <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
      
      {/* CONTENIDO PRINCIPAL */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Tarjeta de bienvenida */}
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <h2 className="text-primary mb-3">¡Bienvenido al Gestor de Gastos Personales!</h2>
                <p className="lead text-muted mb-4">Has iniciado sesión correctamente.</p>
                <div className="alert alert-success">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Sistema listo para usar
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== EXPORTACIÓN DEL COMPONENTE ==========
export default App
