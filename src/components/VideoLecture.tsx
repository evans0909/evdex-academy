// src/components/VideoLecture.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, VideoOff, Users, Mic, MicOff } from "lucide-react";
import { JitsiMeeting } from '@jitsi/react-sdk';

interface VideoLectureProps {
  roomName: string;        // Unique room name for the talk
  userDisplayName: string; // Student's name
  userEmail: string;       // Student's email
  onClose?: () => void;    // Optional close handler
}

export const VideoLecture = ({ roomName, userDisplayName, userEmail, onClose }: VideoLectureProps) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isMeetingActive, setIsMeetingActive] = useState(true);

  if (!isMeetingActive) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <VideoOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Meeting Ended</h3>
          <p className="text-muted-foreground mb-4">You have left the meeting.</p>
          <Button onClick={() => setIsMeetingActive(true)}>
            <Video className="w-4 h-4 mr-2" />
            Rejoin Meeting
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Meeting Controls */}
      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Room: {roomName}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={isAudioMuted ? "bg-red-100" : ""}
          >
            {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVideoMuted(!isVideoMuted)}
            className={isVideoMuted ? "bg-red-100" : ""}
          >
            {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsMeetingActive(false)}>
            Leave Meeting
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Jitsi Meeting Component */}
      <div className="border rounded-lg overflow-hidden">
        <JitsiMeeting
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: isAudioMuted,
            startWithVideoMuted: isVideoMuted,
            subject: `EvDeX Academy Lecture`,
            email: userEmail,
            enableClosePage: true,
            disableDeepLinking: true,
            enableLobby: true,
            prejoinPageEnabled: false, // Skip pre-join screen
          }}
          interfaceConfigOverwrite={{
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop',
              'fullscreen', 'fodeviceselection', 'hangup', 'profile',
              'chat', 'recording', 'livestreaming', 'etherpad',
              'sharedvideo', 'settings', 'raisehand', 'videoquality',
              'filmstrip', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download',
              'help', 'mute-everyone', 'security'
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_REMOTE_DISPLAY_NAME: 'Student',
            DEFAULT_LOCAL_DISPLAY_NAME: userDisplayName,
          }}
          userInfo={{
            displayName: userDisplayName,
            email: userEmail,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '600px';
            iframeRef.style.width = '100%';
            iframeRef.style.border = 'none';
          }}
        />
      </div>
    </div>
  );
};