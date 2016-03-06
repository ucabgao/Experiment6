using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace webbage.chat.model {
    public class Message {
        public User Sender { get; set; }
        public string Content { get; set; }
        public string Sent { get; set; }
        public bool IsCode { get; set; }
    }
}
