import { useState, useRef } from 'react'
import { dummyData } from '../data/dummyData.js'
import { AlertCircle, MapPin, Truck, Play, Video, PlayCircle } from 'lucide-react'

const EmergencyRequests = () => {
  const [showVideo, setShowVideo] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)
  const videoRef = useRef(null)

  const emergencies = [
    {
      id: 1,
      patient: 'Victim - Road Accident',
      ambulance: null,
      location: 'Sector 15, Delhi',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      timestamp: '2 mins ago'
    },
    {
      id: 2,
      patient: 'Elderly - Chest Pain',
      ambulance: null,
      location: 'MG Road, Gurgaon',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      timestamp: '5 mins ago'
    }
  ]

  const openVideoModal = (emergency) => {
    setCurrentVideo(emergency)
    setShowVideo(true)
  }

  const closeVideoModal = () => {
    setShowVideo(false)
    setCurrentVideo(null)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <>
      <div className="space-y-5">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <AlertCircle className="w-10 h-10 text-red-600" />
          <span>Emergency Requests</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {emergencies.map((emergency) => (
            <div key={emergency.id} className="emergency-card p-8 border-4 border-transparent hover:border-red-200 group">
              
              <div className="flex items-center justify-center mb-8 p-3 bg-red-50/50 rounded-2xl border-2 border-red-100">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-bold text-navy text-center">{emergency.patient}</h3>
                
                <div className="flex items-center justify-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <Truck className="w-6 h-6 text-gray-500" />
                  <span className="font-semibold text-base">
                    {emergency.ambulance || 'Not Assigned'}
                  </span>
                </div>
                
                <div className="flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-navy">{emergency.location}</span>
                </div>

                <div 
                  className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 hover:border-purple-200 transition-all cursor-pointer group/video" 
                  onClick={() => openVideoModal(emergency)}
                >
                  <Video className="w-8 h-8 text-purple-600 group-hover/video:scale-110 transition-transform mr-3" />
                  <div>
                    <p className="font-bold text-purple-800 text-lg">View 10-sec Live Clip</p>
                    <p className="text-sm text-purple-600">{emergency.timestamp}</p>
                  </div>
                  <PlayCircle className="w-8 h-8 text-primary ml-3 group-hover/video:rotate-12 transition-transform" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-slate-200">
                <button className="btn-primary flex-1 flex items-center justify-center space-x-2 py-4 text-base font-bold">
                  <Play className="w-6 h-6" />
                  <span>Accept Emergency</span>
                </button>
                <button className="px-8 py-4 border border-slate-300 text-gray-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex-1 text-base">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showVideo && currentVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeVideoModal}>
          <div className="bg-white rounded-3xl p-3 max-w-4xl w-full max-h-[90vh] overflow-auto relative" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={closeVideoModal}
              className="absolute -top-4 -right-4 w-12 h-12 bg-red-600 text-white rounded-2xl shadow-2xl hover:bg-red-700 flex items-center justify-center transition-all z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy mb-4">{currentVideo.patient}</h2>
              <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
                <AlertCircle className="w-5 h-5" />
                <span>10-Second Live Emergency Clip</span>
              </div>
            </div>

            <div className="relative mb-8">
              <video 
                ref={videoRef}
                src={currentVideo.videoUrl}
                controls 
                className="w-full rounded-2xl shadow-2xl border-4 border-gray-200"
                preload="metadata"
                onTimeUpdate={() => {
                  if (videoRef.current && videoRef.current.currentTime >= 10) {
                    videoRef.current.pause()
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-slate-200">
              <button className="btn-primary flex-1 py-4 text-base font-bold">
                Assign Ambulance Now
              </button>
              <button 
                onClick={closeVideoModal}
                className="px-8 py-4 border border-slate-300 text-gray-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex-1 text-base"
              >
                Close Video
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default EmergencyRequests