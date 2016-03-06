using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace webbage.chat.model {
    public class Room {
        public int RoomKey { get; set; }
        public string RoomID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<User> Users { get; set; }
        public List<Message> Messages { get; set; }
    }
}
