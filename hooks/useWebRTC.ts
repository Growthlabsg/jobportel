/**
 * WebRTC hook for video/audio calls
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

interface WebRTCCallState {
  isCallActive: boolean;
  isLocalVideoEnabled: boolean;
  isLocalAudioEnabled: boolean;
  isRemoteVideoEnabled: boolean;
  isRemoteAudioEnabled: boolean;
  callType: 'video' | 'audio' | null;
}

export function useWebRTC(conversationId: string | null) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const { sendMessage } = useWebSocket(conversationId || '');

  const [callState, setCallState] = useState<WebRTCCallState>({
    isCallActive: false,
    isLocalVideoEnabled: true,
    isLocalAudioEnabled: true,
    isRemoteVideoEnabled: false,
    isRemoteAudioEnabled: false,
    callType: null,
  });

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && conversationId) {
        sendMessage('call_ice_candidate', {
          conversationId,
          candidate: event.candidate,
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setCallState((prev) => ({
          ...prev,
          isRemoteVideoEnabled: true,
          isRemoteAudioEnabled: true,
        }));
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [conversationId, sendMessage]);

  // Start call
  const startCall = useCallback(async (type: 'video' | 'audio') => {
    try {
      const constraints: MediaStreamConstraints = {
        video: type === 'video' ? true : false,
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = initializePeerConnection();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (conversationId) {
        sendMessage('call_offer', {
          conversationId,
          offer: pc.localDescription,
          callType: type,
        });
      }

      setCallState({
        isCallActive: true,
        isLocalVideoEnabled: type === 'video',
        isLocalAudioEnabled: true,
        isRemoteVideoEnabled: false,
        isRemoteAudioEnabled: false,
        callType: type,
      });
    } catch (error) {
      console.error('Error starting call:', error);
      alert('Failed to start call. Please check your camera/microphone permissions.');
    }
  }, [conversationId, initializePeerConnection, sendMessage]);

  // Answer call
  const answerCall = useCallback(async (offer: RTCSessionDescriptionInit, callType: 'video' | 'audio') => {
    try {
      const constraints: MediaStreamConstraints = {
        video: callType === 'video' ? true : false,
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = initializePeerConnection();
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (conversationId) {
        sendMessage('call_answer', {
          conversationId,
          answer: pc.localDescription,
        });
      }

      setCallState({
        isCallActive: true,
        isLocalVideoEnabled: callType === 'video',
        isLocalAudioEnabled: true,
        isRemoteVideoEnabled: false,
        isRemoteAudioEnabled: false,
        callType,
      });
    } catch (error) {
      console.error('Error answering call:', error);
      alert('Failed to answer call. Please check your camera/microphone permissions.');
    }
  }, [conversationId, initializePeerConnection, sendMessage]);

  // End call
  const endCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setCallState({
      isCallActive: false,
      isLocalVideoEnabled: false,
      isLocalAudioEnabled: false,
      isRemoteVideoEnabled: false,
      isRemoteAudioEnabled: false,
      callType: null,
    });
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCallState((prev) => ({
          ...prev,
          isLocalVideoEnabled: videoTrack.enabled,
        }));
      }
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setCallState((prev) => ({
          ...prev,
          isLocalAudioEnabled: audioTrack.enabled,
        }));
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    callState,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    endCall,
    toggleVideo,
    toggleAudio,
  };
}

