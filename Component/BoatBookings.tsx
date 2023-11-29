import { BoatBooking } from "@/pages/Boat/[id]";
import styles from "../styles/BoatBooking.module.css";
import { User } from "@/pages/Users";
import { useSelector } from "react-redux";
import { ApiMainLink } from "./ApiLink";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BoatBookings({
  ownerIds,
  myUserIdExists,
  bookings,
  users,
}: {
  ownerIds: number[];
  myUserIdExists: { bool: boolean; myId: number };
  bookings: BoatBooking[];
  users: User[];
}) {
  const [bookingS, setBookingS] = useState<BoatBooking[]>([]);
  const [date, setDate] = useState(
    new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  useEffect(() => {
    setBookingS(bookings);
  }, [bookings]);
  const user = useSelector((state: any) => state.reducer.userLoggedIn);
  const handleApprovalClick = async (bookingId: number) => {
    try {
      const response = await fetch(`${ApiMainLink}/approveBoatBookingRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ bookingId }),
      });
      if (response.ok) {
        const { data }: { data: BoatBooking } = await response.json();
        console.log(`Your Request Is Generated!`);
        setBookingS((prevData) => {
          return prevData.map((booking) => {
            if (booking.id === bookingId) {
              return { ...data };
            } else {
              return booking;
            }
          });
        });
      } else {
        console.error(
          `Error approving booking ${bookingId}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error(`Error during approval: ${error}`);
    }
  };
  const requestForBookingSlot = async (date: Date) => {
    try {
      const response = await fetch(`${ApiMainLink}/requestBoatBookingRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ date }),
      });
      if (response.ok) {
        const { data }: { data: Date } = await response.json();
      } else {
        console.error(`Error in request booking ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error during approval: ${error}`);
    }
  };
  const isBookRequestDisabled = !selectedDate;
  return (
    <div>
      {ownerIds.length > 0 && (
        <div>
          <h3 className={styles.heading + " mt-3"}>All Bookings</h3>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Requested By</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>From&nbsp;-&nbsp;To</th>
                {myUserIdExists.bool && (
                  <>
                    <th className={styles.th}>Approved By</th>
                    <th className={styles.th}>Your Approval</th>
                    <th className={styles.th}>Booking Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {bookingS.map((booking) => (
                <tr className={styles.tr} key={booking.id}>
                  <td className={styles.td}>{booking.id}</td>
                  <th className={styles.td}>
                    {users.find((user) => user.id === booking.userId)?.name ||
                      "Unknown User"}
                  </th>
                  <td className={styles.td}>{booking.BookingDate}</td>
                  <td className={styles.td}>
                    {booking.From}&nbsp;-&nbsp;{booking.To}
                  </td>
                  {myUserIdExists.bool && (
                    <>
                      <td className={styles.td}>
                        {booking.ApprovedBy.map((userId, index) => {
                          const user = users.find((user) => user.id === userId);
                          return user ? (
                            <span key={user.id}>
                              {user.name}
                              {index < booking.ApprovedBy.length - 1 && ", "}
                            </span>
                          ) : (
                            "No Approval Yet"
                          );
                        })}
                      </td>
                      {booking.ApprovedBy.includes(myUserIdExists.myId) ? (
                        <td
                          className={styles.td}
                          style={{ backgroundColor: "green" }}
                        >
                          Approved
                        </td>
                      ) : (
                        <td className={styles.td}>
                          <button
                            className={styles.approvalButton}
                            onClick={() => handleApprovalClick(booking.id)}
                          >
                            Approve
                          </button>
                        </td>
                      )}
                      <td
                        className={styles.td}
                        style={{
                          backgroundColor: booking.Approved
                            ? "green"
                            : "orange",
                        }}
                      >
                        {booking.Approved ? "Booked" : "Pending"}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {myUserIdExists.bool && ownerIds.length > 0 && (
        <div className="mt-5">
          <h3 className={styles.heading}>Request Booking of Slot</h3>
          <DatePicker
            showTimeSelect
            minDate={new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)}
            maxDate={new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)}
            minTime={new Date(0, 0, 0, 8, 0)}
            maxTime={new Date(0, 0, 0, 23, 0)}
            selected={date}
            onChange={(date: Date) => {
              setDate(date);
              setSelectedDate(date);
            }}
          />
          <button
            className={styles.approvalButton}
            onClick={() => requestForBookingSlot(date)}
            disabled={isBookRequestDisabled}
          >
            Book Request
          </button>
        </div>
      )}
    </div>
  );
}

export default BoatBookings;
