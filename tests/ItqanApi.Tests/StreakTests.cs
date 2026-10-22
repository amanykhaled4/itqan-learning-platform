using ItqanApi.Services;

namespace ItqanApi.Tests;

public class StreakTests
{
    private static DateTime DaysAgo(int days) => DateTime.Now.Date.AddDays(-days).AddHours(12).ToUniversalTime();

    [Fact]
    public void No_activity_means_no_streak() =>
        Assert.Equal(0, ProgressService.Streak([]));

    [Fact]
    public void Consecutive_days_ending_today_are_counted() =>
        Assert.Equal(3, ProgressService.Streak([DaysAgo(0), DaysAgo(1), DaysAgo(2), DaysAgo(2)]));

    [Fact]
    public void A_streak_ending_yesterday_still_counts() =>
        Assert.Equal(2, ProgressService.Streak([DaysAgo(1), DaysAgo(2)]));

    [Fact]
    public void A_missed_day_breaks_the_streak() =>
        Assert.Equal(1, ProgressService.Streak([DaysAgo(0), DaysAgo(2), DaysAgo(3)]));
}
