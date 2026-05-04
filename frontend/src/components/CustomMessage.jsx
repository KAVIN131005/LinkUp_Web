import React from "react";
import { MessageSimple, useMessageContext } from "stream-chat-react";
import { Check, CheckCheck } from "lucide-react";

const CustomMessage = (props) => {
  const { message } = props;
  const { client } = useMessageContext();

  // Custom status indicator component
  const MessageStatus = ({ message, client }) => {
    if (!message || !client) return null;

    const isFromCurrentUser = message.user.id === client.user?.id;

    if (!isFromCurrentUser) return null;

    // Get the channel to check read status
    const channel = client.channel("messaging", message.channel?.id);
    if (!channel) return null;

    // Check if message is read by other members
    const readBy = channel.state.read || {};
    const otherMembers = Object.keys(readBy).filter(id => id !== client.user.id);

    // Check if any other member has read past this message
    const isRead = otherMembers.some(memberId => {
      const memberRead = readBy[memberId];
      return memberRead && memberRead.last_read >= new Date(message.created_at).getTime() / 1000;
    });

    return (
      <div className="flex items-center ml-2 opacity-60">
        {isRead ? (
          // Blue double tick for read messages
          <CheckCheck className="w-4 h-4 text-blue-400" />
        ) : (
          // Gray single tick for sent/delivered
          <Check className="w-4 h-4 text-gray-300" />
        )}
      </div>
    );
  };

  return (
    <div className="flex items-end gap-2 group py-1 hover:bg-gray-50/50 rounded-lg px-2 transition-all duration-150">
      <div className="flex-1">
        <MessageSimple {...props} />
      </div>
      <div className="hidden group-hover:flex items-center">
        <MessageStatus message={message} client={client} />
      </div>
    </div>
  );
};

export default CustomMessage;