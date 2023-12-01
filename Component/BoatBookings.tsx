import { BoatBooking } from "@/pages/Boat/[id]";
import styles from "../styles/BoatBooking.module.css";
import { User } from "@/pages/Users";
import { useSelector } from "react-redux";
import { ApiMainLink } from "./ApiLink";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";
import { showSwal } from "./SwalAlert";

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
  const router = useRouter();
  const [bookingS, setBookingS] = useState<BoatBooking[]>([]);
  const [date, setDate] = useState(
    new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const user = useSelector((state: any) => state.reducer.userLoggedIn);
  const handleApprovalClick = async (bookingId: number) => {
    try {
      const response: any = await fetch(`${ApiMainLink}/approveBoatBookingRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ bookingId }),
      });
      if (response.ok) {
        showSwal("Approval Success", "Booking Approved",200, undefined, router);
        const { data }: { data: BoatBooking } = await response.json();
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
        showSwal("Approval Failed", response?.message, 400, undefined, router);
        console.error(
          `Error approving booking ${bookingId}: ${response.statusText}`
        );
      }
    } catch (error:any) {
      showSwal("Approval Failed", error?.response?.message, 400, undefined, router);
      console.error(`Error during approval: ${error}`);
    }
  };
  const requestForBookingSlot = async (date: Date, endDate: Date) => {
    try {
      const { id } = router.query;
      const response:any = await fetch(`${ApiMainLink}/requestBoatBookingRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ date, endDate, boatId: id }),
      });
      if (response.ok) {
        const { data }: { data: BoatBooking } = await response.json();
        showSwal("Request Success", "Booking Request Successfully Made", 200, undefined, router);
        setBookingS((prevData) => {
          return [...prevData, data];
        });
      } else {
        console.error(`Error in request booking ${response.statusText}`);
        showSwal("Request Failed", response?.message, 400, undefined, router);
      }
    } catch (error:any) {
      showSwal("Request Failed", error?.response?.message, 400, undefined, router);
      console.error(`Error during approval: ${error}`);
    }
  };
  function getNextDate(currentDate: Date) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return new Date(nextDate);
  }
  const isBookRequestDisabled = !selectedDate || !endDate;
  useEffect(() => {
    setBookingS(bookings);
    setEndDate(getNextDate(date));
  }, [bookings, date]);
  return (
    <div>
      {ownerIds.length > 0 && bookingS.length > 0 && (
        <div>
          <h3 className={styles.heading + " mt-3"}>All Bookings</h3>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Requested By</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>
                  From&nbsp;-&nbsp;To&nbsp;(MM-DD-YY HH:MM AA)
                </th>
                {myUserIdExists.bool && (
                  <>
                    <th className={styles.th}>Approved By</th>
                    <th className={styles.th}>Your Approval</th>
                  </>
                )}
                <th className={styles.th}>Booking Status</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
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
                    </>
                  )}
                  <td
                    className={styles.td}
                    style={{
                      backgroundColor: booking.Approved ? "green" : "orange",
                    }}
                  >
                    {booking.Approved ? "Booked" : "Pending"}
                  </td>
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
            dateFormat="MMMM d, yyyy h:mm aa"
            timeFormat="HH:mm"
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
          &nbsp;-&nbsp;
          <DatePicker
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            timeFormat="HH:mm"
            minDate={
              new Date(new Date(date).getTime() + 1 * 24 * 60 * 60 * 1000)
            }
            maxDate={
              new Date(new Date(date).getTime() + 6 * 24 * 60 * 60 * 1000)
            }
            minTime={new Date(0, 0, 0, 0.5, 0)}
            maxTime={new Date(0, 0, 0, 23.5, 0)}
            selected={endDate}
            onChange={(endDate: Date) => {
              setEndDate(endDate);
              setSelectedDate(endDate);
            }}
            disabled={!selectedDate}
          />
          &nbsp;
          <button
            className={styles.approvalButton}
            onClick={() => requestForBookingSlot(date, endDate)}
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
