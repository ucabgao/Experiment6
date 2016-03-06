using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webbage.chat.model;

namespace webbage.chat.context {
    public class GlobalData {
        public GlobalData() {

        }

        static GlobalData() {
            if (rooms == null) {
                rooms = new List<Room>{
                    new Room { RoomKey = 1, RoomID = "sandbox", Name = "Sandbox", Description = "A test room to play around in", Users = new List<User>(), Messages = new List<Message>() }
                };
            }
        }

        private static List<Room> rooms { get; set; }
        public static List<Room> Rooms { get { return rooms; } }
    }
}
