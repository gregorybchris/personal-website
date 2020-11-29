const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const yearNumber = date.getFullYear();
  const monthNumber = date.getMonth() + 1;
  const dayNumber = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[monthNumber - 1];
  return `${monthName}. ${dayNumber}, ${yearNumber}`;
};

export { formatDate };
