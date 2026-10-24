import React from 'react';

export default function ResultCard({ result, scanType }) {
    if (!result || !scanType) return null;

    const type = scanType.toLowerCase();
    const isComp = type.includes('comprehensive');

    const renderBlock = (title, data) => {
        if (!data) return null;

        // Check if backend actually sent the images object
        const hasImages = data.images && data.images.original;

        return (
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ marginTop: 0, fontSize: '1.5rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>{title}</h3>
                <p style={{ fontSize: '1.1rem' }}>
                    <strong>Diagnosis:</strong> <span style={{ color: data.diagnosis?.toLowerCase().includes('normal') || data.diagnosis?.toLowerCase().includes('nondemented') ? '#16a34a' : '#dc2626' }}>{data.diagnosis}</span>
                </p>
                <p style={{ fontSize: '1.1rem' }}>
                    <strong>AI Confidence:</strong> <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{data.confidence}%</span>
                </p>

                {/* DIAGNOSTIC ERROR TRIGGER */}
                {!hasImages && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', border: '1px solid #f87171' }}>
                        <strong>Backend Payload Error:</strong> The FastAPI backend is not sending the `images` dictionary. You must SAVE `predict.py` and RESTART the Uvicorn server.
                    </div>
                )}

                {/* IMAGE RENDER */}
                {hasImages && (
                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {data.images.original && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ fontWeight: '600', color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase' }}>Original MRI</p>
                                <img src={data.images.original} alt="Original" style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                            </div>
                        )}
                        {data.images.segmentation && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ fontWeight: '600', color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase' }}>U-Net Segmentation</p>
                                <img src={data.images.segmentation} alt="Segmentation" style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                            </div>
                        )}
                        {data.images.gradcam && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ fontWeight: '600', color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase' }}>Grad-CAM Visualization</p>
                                <img src={data.images.gradcam} alt="Grad-CAM" style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '20px auto' }}>
            {(type.includes('tumor') || isComp) && 
                renderBlock("Brain Tumor Analysis", isComp ? result.comprehensive_report?.tumor_screening : result)
            }
            {(type.includes('alzheimer') || isComp) && 
                renderBlock("Alzheimer's Disease Analysis", isComp ? result.comprehensive_report?.alzheimers_screening : result)
            }
        </div>
    );
}