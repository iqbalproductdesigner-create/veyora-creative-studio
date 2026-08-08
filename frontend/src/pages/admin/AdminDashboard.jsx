import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [portfolios, setPortfolios] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resPort, resServ] = await Promise.all([
        api.get('/portfolio').catch(() => ({ data: [] })),
        api.get('/services').catch(() => ({ data: [] }))
      ]);
      if (resPort.data) setPortfolios(Array.isArray(resPort.data) ? resPort.data : []);
      if (resServ.data) setServices(Array.isArray(resServ.data) ? resServ.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080D10', color: '#D9DEE6', display: 'flex', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '260px', backgroundColor: '#121417', borderRight: '1px solid #23262B', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#FFF', fontWeight: 'bold', fontSize: '20px', letterSpacing: '2px', marginBottom: '4px' }}>VEYORA</h2>
          <p style={{ color: '#A3AAB4', fontSize: '10px', textTransform: 'uppercase', marginBottom: '32px' }}>CMS Admin Panel</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('portfolio')}
              style={{
                padding: '12px 16px', borderRadius: '10px', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
                backgroundColor: activeTab === 'portfolio' ? '#5C6773' : 'transparent', color: activeTab === 'portfolio' ? '#FFF' : '#A3AAB4'
              }}
            >
              Portofolio & Karya
            </button>
            <button
              onClick={() => setActiveTab('services')}
              style={{
                padding: '12px 16px', borderRadius: '10px', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
                backgroundColor: activeTab === 'services' ? '#5C6773' : 'transparent', color: activeTab === 'services' ? '#FFF' : '#A3AAB4'
              }}
            >
              Layanan Jasa
            </button>
          </div>
        </div>

        <button onClick={() => navigate('/')} style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#23262B', color: '#D9DEE6', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
          Lihat Live Website ↗
        </button>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        <h1 style={{ color: '#FFF', fontSize: '24px', margin: 0, paddingBottom: '16px', borderBottom: '1px solid #23262B', marginBottom: '24px' }}>
          Admin Panel Veyora
        </h1>

        {activeTab === 'portfolio' && (
          <div>
            <h3 style={{ color: '#FFF' }}>Daftar Portofolio ({portfolios.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {portfolios.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#121417', border: '1px solid #23262B', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ color: '#FFF', margin: '0 0 8px 0' }}>{item.project_name || item.title}</h4>
                  <p style={{ color: '#A3AAB4', fontSize: '12px', margin: 0 }}>{item.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h3 style={{ color: '#FFF' }}>Daftar Layanan ({services.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {services.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#121417', border: '1px solid #23262B', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ color: '#FFF', margin: '0 0 8px 0' }}>{item.title || item.name}</h4>
                  <p style={{ color: '#A3AAB4', fontSize: '12px', margin: 0 }}>{item.starting_price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
