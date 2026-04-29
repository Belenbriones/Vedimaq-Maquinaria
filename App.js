import React, { useState } from 'react';
import { Modal, Steps, Form, Input, Select, DatePicker, Button, Card, Divider, Row, Col, Typography, Result, message } from 'antd';
import { CheckCircleFilled, DownloadOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// Colores de la marca Vedimaq
const COLORS = {
  black: '#1A1A1A',
  yellow: '#FFB800',
  white: '#FFFFFF',
  gray: '#F5F5F5',
  darkGray: '#333333',
};

// Estilos globales integrados para sobreescribir Ant Design
const globalStyles = `
  .vedimaq-modal .ant-modal-content {
    background-color: ${COLORS.white};
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
  }
  .vedimaq-modal .ant-modal-header {
    background-color: ${COLORS.black};
    border-bottom: none;
    padding: 24px;
    border-radius: 12px 12px 0 0;
  }
  .vedimaq-modal .ant-modal-title {
    color: ${COLORS.yellow};
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .vedimaq-modal .ant-modal-close {
    color: ${COLORS.white};
  }
  .vedimaq-modal .ant-modal-close:hover {
    color: ${COLORS.yellow};
  }
  .vedimaq-steps {
    background-color: ${COLORS.black};
    padding: 0 40px 20px 40px;
  }
  .vedimaq-steps .ant-steps-item-title {
    color: ${COLORS.white} !important;
    font-size: 12px;
    text-transform: uppercase;
  }
  .vedimaq-steps .ant-steps-item-process .ant-steps-item-icon {
    background-color: ${COLORS.yellow};
    border-color: ${COLORS.yellow};
  }
  .vedimaq-steps .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon {
    color: ${COLORS.black};
    font-weight: bold;
  }
  .vedimaq-steps .ant-steps-item-finish .ant-steps-item-icon {
    border-color: ${COLORS.yellow};
  }
  .vedimaq-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: ${COLORS.yellow};
  }
  .vedimaq-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
    background-color: ${COLORS.yellow};
  }
  .vedimaq-btn-primary {
    background-color: ${COLORS.yellow};
    border-color: ${COLORS.yellow};
    color: ${COLORS.black};
    font-weight: bold;
  }
  .vedimaq-btn-primary:hover, .vedimaq-btn-primary:focus {
    background-color: #e5a600;
    border-color: #e5a600;
    color: ${COLORS.black};
  }
  .vedimaq-btn-secondary {
    background-color: transparent;
    border-color: ${COLORS.white};
    color: ${COLORS.white};
  }
  .vedimaq-btn-secondary:hover {
    border-color: ${COLORS.yellow};
    color: ${COLORS.yellow};
  }
`;

export default function QuotationModal({ visible, onClose, machineInfo }) {
  const [current, setCurrent] = useState(0);
  
  // 1. Hook useState para guardar todos los datos del formulario interactivamente
  const [formData, setFormData] = useState({
    interes: 'compra',
    duracion: '',
    ubicacion: '',
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    fechas: null,
    fechasString: ''
  });

  // Datos mockeados de la máquina si no se pasan por props
  const machine = machineInfo || {
    id: 'CAT-950GC',
    name: 'Caterpillar 950GC',
    category: 'Cargadores',
    price: 33800000,
    image: 'https://via.placeholder.com/200x120/1A1A1A/FFB800?text=Caterpillar+950GC',
  };

  // Función para manejar cambios en los inputs
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Validación manual rápida antes de avanzar
    const { interes, nombre, rut, email, telefono, ubicacion, fechas } = formData;
    
    if (!nombre || !rut || !email || !telefono) {
      message.error("Por favor completa los campos obligatorios: Nombre, RUT, Email y Teléfono.");
      return;
    }
    
    if (interes === 'arriendo') {
      if (!ubicacion || !fechas) {
        message.error("Por favor completa la Ubicación y las Fechas para el arriendo.");
        return;
      }
    }

    setCurrent(current + 1);
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = () => {
    // Simulación de envío
    setCurrent(current + 1);
  };

  // Cálculos para el paso 2 (Resumen)
  const subtotal = machine.price;
  const iva = subtotal * 0.19;
  const total = subtotal + iva;
  const formatCurrency = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  // Paso 1: Formulario de Datos
  const renderStep1 = () => (
    <Row gutter={32}>
      <Col span={15}>
        <Form layout="vertical" requiredMark={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<b>INTERÉS EN</b>} required>
                <Select 
                  size="large" 
                  value={formData.interes} 
                  onChange={(value) => handleChange('interes', value)}
                >
                  <Option value="compra">Compra</Option>
                  <Option value="arriendo">Arriendo</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<b>MARCA / MODELO</b>}>
                <Input 
                  size="large" 
                  disabled 
                  value={machine.name} 
                  style={{ backgroundColor: '#fff', color: '#000' }} 
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Campos dinámicos de Arriendo */}
          {formData.interes === 'arriendo' && (
            <div style={{ backgroundColor: '#fffbe6', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: `1px solid ${COLORS.yellow}` }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<b>DURACIÓN (MESES)</b>}>
                    <Input 
                      type="number" 
                      size="large" 
                      placeholder="Ej: 3" 
                      value={formData.duracion}
                      onChange={(e) => handleChange('duracion', e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<b>UBICACIÓN DEL PROYECTO *</b>} required>
                    <Input 
                      size="large" 
                      placeholder="Región / Comuna / Faena" 
                      value={formData.ubicacion}
                      onChange={(e) => handleChange('ubicacion', e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={<b>FECHAS DE ARRIENDO *</b>} required>
                    <RangePicker 
                      size="large" 
                      style={{ width: '100%' }} 
                      format="DD-MM-YYYY" 
                      value={formData.fechas}
                      onChange={(dates, dateStrings) => {
                        handleChange('fechas', dates);
                        handleChange('fechasString', dateStrings.join(' al '));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          <Form.Item label={<b>NOMBRE O EMPRESA *</b>} required>
            <Input 
              size="large" 
              placeholder="Ej: Juan Pérez / Constructora SpA" 
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<b>RUT *</b>} required>
                <Input 
                  size="large" 
                  placeholder="12.345.678-9" 
                  value={formData.rut}
                  onChange={(e) => handleChange('rut', e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<b>EMAIL DE EMPRESA *</b>} required>
                <Input 
                  type="email"
                  size="large" 
                  placeholder="correo@empresa.cl" 
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<b>TELÉFONO DE CONTACTO *</b>} required>
            <Input 
              size="large" 
              placeholder="+56 9 1234 5678" 
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
            />
          </Form.Item>

        </Form>
      </Col>

      <Col span={9}>
        {/* Resumen de la máquina (Lateral derecho) */}
        <Card bordered={false} style={{ backgroundColor: COLORS.gray, height: '100%' }}>
          <Text type="secondary" style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>RESUMEN</Text>
          <div style={{ marginTop: '16px', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={machine.image} alt={machine.name} style={{ width: '100%', display: 'block' }} />
          </div>
          <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>{machine.category}</Text>
          <Title level={4} style={{ marginTop: 0, marginBottom: '8px' }}>{machine.name}</Title>
          <div style={{ display: 'inline-block', backgroundColor: COLORS.yellow, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
            {formData.interes === 'compra' ? 'COMPRA' : 'ARRIENDO'}
          </div>
          
          <Divider />
          
          <Text type="secondary" style={{ fontSize: '10px', fontWeight: 'bold' }}>PRECIO REFERENCIAL</Text>
          <Title level={3} style={{ marginTop: 0 }}>{formatCurrency(machine.price)}</Title>
        </Card>
      </Col>
    </Row>
  );

  // Paso 2: Revisión de Cotización
  const renderStep2 = () => (
    <Row gutter={32}>
      <Col span={14}>
        <Title level={3}>Resumen de Solicitud</Title>
        <Text type="secondary">Por favor, revise los detalles de su solicitud antes de enviarla.</Text>
        
        <Card style={{ marginTop: '24px', borderColor: '#eaeaea' }}>
          <Row align="middle">
            <Col span={6}>
              <img src={machine.image} alt={machine.name} style={{ width: '100%', borderRadius: '4px' }} />
            </Col>
            <Col span={18} style={{ paddingLeft: '16px' }}>
              <Title level={5} style={{ margin: 0 }}>{machine.name}</Title>
              <Text type="secondary">{machine.category}</Text>
              <div>
                <span style={{ display: 'inline-block', backgroundColor: COLORS.yellow, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginTop: '8px' }}>
                  SERVICIO: {formData.interes.toUpperCase()}
                </span>
              </div>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: '16px', borderColor: '#eaeaea' }}>
          <Title level={5} style={{ color: COLORS.yellow }}><CheckCircleFilled /> Información del Solicitante</Title>
          <Row style={{ marginTop: '16px' }}>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: '10px' }}>NOMBRE COMPLETO</Text>
              <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>{formData.nombre}</div>
              
              <Text type="secondary" style={{ fontSize: '10px' }}>RUT</Text>
              <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>{formData.rut}</div>
            </Col>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: '10px' }}>CORREO ELECTRÓNICO</Text>
              <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>{formData.email}</div>
              
              <Text type="secondary" style={{ fontSize: '10px' }}>TELÉFONO</Text>
              <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>{formData.telefono}</div>
            </Col>
          </Row>
          
          {formData.interes === 'arriendo' && (
             <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
               <Row>
                 <Col span={12}>
                   <Text type="secondary" style={{ fontSize: '10px' }}>UBICACIÓN</Text>
                   <div style={{ fontWeight: 'bold' }}>{formData.ubicacion}</div>
                 </Col>
                 <Col span={12}>
                   <Text type="secondary" style={{ fontSize: '10px' }}>FECHAS</Text>
                   <div style={{ fontWeight: 'bold' }}>{formData.fechasString}</div>
                 </Col>
               </Row>
             </div>
          )}
        </Card>
      </Col>

      <Col span={10}>
        <Card style={{ backgroundColor: COLORS.black, color: COLORS.white, height: '100%' }}>
          <Text style={{ color: '#aaa', fontSize: '10px', letterSpacing: '1px', fontWeight: 'bold' }}>RESUMEN DE COSTOS</Text>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <Text style={{ color: COLORS.white }}>SUBTOTAL EQUIPO</Text>
            <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>{formatCurrency(subtotal)}</Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Text style={{ color: '#aaa' }}>IVA (19%)</Text>
            <Text style={{ color: '#aaa', fontWeight: 'bold' }}>{formatCurrency(iva)}</Text>
          </div>
          
          <Divider style={{ borderColor: '#333' }} />
          
          <Text style={{ color: COLORS.yellow, fontSize: '12px', fontWeight: 'bold' }}>TOTAL ESTIMADO</Text>
          <Title level={2} style={{ color: COLORS.white, marginTop: '4px', marginBottom: 0 }}>{formatCurrency(total)}</Title>
          <Text style={{ color: '#aaa', fontSize: '10px' }}>+ IVA Incluido</Text>

          <Button 
            className="vedimaq-btn-primary" 
            size="large" 
            block 
            style={{ marginTop: '32px', height: '50px' }}
            onClick={handleSubmit}
          >
            Enviar Solicitud <ArrowRightOutlined />
          </Button>

          <Button 
            className="vedimaq-btn-secondary" 
            size="large" 
            block 
            style={{ marginTop: '16px', height: '50px' }}
          >
            <DownloadOutlined /> DESCARGAR PDF
          </Button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text style={{ color: '#888', fontSize: '10px' }}>
              Al enviar esta solicitud, nuestro equipo técnico se contactará en un plazo máximo de 2 horas hábiles.
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );

  // Paso 3: Enviado con éxito
  const renderStep3 = () => (
    <Result
      icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
      title={<span style={{ fontSize: '28px', fontWeight: 'bold' }}>¡Cotización enviada correctamente a tu correo!</span>}
      subTitle={
        <div style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Hemos enviado una copia con el PDF adjunto a <b>{formData.email}</b>. Nuestro equipo técnico te contactará en menos de 2 horas hábiles.
          <br /><br />
          <span style={{ fontSize: '12px', color: '#999' }}>Folio #VM-{Math.floor(Math.random() * 900000) + 100000}</span>
        </div>
      }
      extra={[
        <Button key="download" size="large" icon={<DownloadOutlined />}>
          Descargar PDF
        </Button>,
        <Button key="close" className="vedimaq-btn-primary" size="large" onClick={onClose}>
          Ver más maquinaria
        </Button>,
      ]}
    />
  );

  return (
    <>
      <style>{globalStyles}</style>
      <Modal
        title={`COTIZACIÓN · PASO ${current + 1}/3`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={950}
        centered
        className="vedimaq-modal"
        destroyOnClose
        maskStyle={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', backdropFilter: 'blur(5px)' }}
      >
        <div className="vedimaq-steps">
          <Steps current={current} responsive={false}>
            <Step title="1. DATOS" />
            <Step title="2. REVISAR" />
            <Step title="3. ENVIADO" />
          </Steps>
        </div>

        <div style={{ padding: '32px 40px', minHeight: '400px' }}>
          {current === 0 && renderStep1()}
          {current === 1 && renderStep2()}
          {current === 2 && renderStep3()}
        </div>

        {current === 0 && (
          <div style={{ padding: '16px 40px 32px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0' }}>
            <Button size="large" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="vedimaq-btn-primary" size="large" onClick={handleNext}>
              Continuar <ArrowRightOutlined />
            </Button>
          </div>
        )}

        {current === 1 && (
          <div style={{ padding: '16px 40px 32px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
            <Button type="link" onClick={handlePrev} icon={<ArrowLeftOutlined />} style={{ color: '#666' }}>
              Editar datos
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
