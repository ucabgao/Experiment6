using Microsoft.AspNet.SignalR;

using System.Collections.Generic;
using System.Threading.Tasks;

using webbage.chat.context;
using webbage.chat.model;

namespace webbage.chat.web.hub {
    public class RoomHub : Hub {
        public List<Room> GetRooms() {
            return GlobalData.Rooms;
        }
    }
}